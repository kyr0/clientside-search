import { BKTree } from './bktree'
import { BM25 } from './bm25'
import { getPhoneticWeight } from './phonetic/phonetic'
import { TfidfVectorizer } from './tfidf'

export interface Document {
  id: string
  metadata: any
}

export interface LanguageSupport {
  iso2Language: Iso2LanguageKey
  stem: (word: string) => string
  stopwords: string[]
}

export type Iso2LanguageKey = string

export interface LanguageStopwords {
  [key: Iso2LanguageKey]: Array<string>
}

export const DEFAULT_LANGUAGE: Iso2LanguageKey = 'en'

export type Language = 'en' | 'de'

export class SearchEngine {
  index: Record<string, Record<string, number>>
  docToWords: Record<string, string[]>
  documents: Record<string, string>
  vectorizer: TfidfVectorizer
  bkTree: BKTree
  stopWords: Set<string>
  bm25: BM25
  docMetadata: Record<string, any>
  language: LanguageSupport

  constructor(language: LanguageSupport, ngramRange: [number, number] = [1, 1]) {
    this.index = {}
    this.docToWords = {}
    this.documents = {}
    this.bm25 = new BM25()
    this.language = language
    this.stopWords = new Set(language.stopwords)
    this.vectorizer = new TfidfVectorizer(ngramRange)
    this.bkTree = new BKTree()
    this.docMetadata = {}
  }

  static fromHydratedState(compressedJSON: any, language: LanguageSupport) {
    const jsonData = JSON.parse(compressedJSON)
    const searchEngine = new SearchEngine(language, jsonData.ngramRange)
    searchEngine.index = jsonData.index
    searchEngine.bm25 = BM25.fromJSON(jsonData.bm25)
    searchEngine.vectorizer = new TfidfVectorizer(jsonData.ngramRange)
    searchEngine.bkTree = BKTree.fromJSON(jsonData.bkTree)
    searchEngine.docMetadata = jsonData.docMetadata
    return searchEngine
  }

  // Method to load index from a JSON file on the server
  static async fromHydratedStateRemote(filePath: string, language: LanguageSupport) {
    try {
      const response = await fetch(filePath)
      const jsonData = await response.text()
      return SearchEngine.fromHydratedState(jsonData, language)
    } catch (error) {
      console.error('Error loading index from compressed JSON:', error)
    }
  }

  hydrateState() {
    return JSON.stringify({
      index: this.index,
      bm25: this.bm25.toJSON(),
      ngramRange: this.vectorizer.ngramRange,
      bkTree: this.bkTree.toJSON(),
      docMetadata: this.docMetadata,
    })
  }

  processText(text: string): string[] {
    let words = text
      .replace(/[.,!?;:]/g, '')
      .replace(/[\-]/g, ' ')
      .toLowerCase()
      .split(' ')
      .filter((word) => word.trim() !== '')
    words = words.filter((word) => !this.stopWords.has(word))
    words = words.map((word) => this.language.stem(word))
    return words
  }

  addDocument(text: string, metadata: any = {}) {
    const docId = this.generateId(text)
    const words = this.processText(text)

    // include meta data in the index
    for (const key in metadata) {
      if (typeof metadata[key] !== 'string' || !key.startsWith('index_')) {
        continue
      }
      const metaWords = this.processText(metadata[key])
      words.push(...metaWords)
    }

    this.bm25.addDocument(words, docId)
    this.vectorizer.addDocument(docId, words)

    words.forEach((word) => {
      if (!this.index[word]) {
        this.index[word] = {}
      }
      this.index[word][docId] = this.vectorizer.tfidf(word, words)
      this.bkTree.insert(word)
    })

    this.documents[docId] = text
    this.docToWords[docId] = [...new Set(words)]
    this.docMetadata[docId] = metadata

    return docId
  }

  search(query: string) {
    const terms = this.processText(query)
    const exactScores: Record<string, number> = {}
    const fuzzyScores: Record<string, number> = {}
    const seenDocIds: Set<string> = new Set()
    const bm25ScoresCache: Record<string, any> = {}

    terms.forEach((term) => {
      // use BKTree to find similar words
      const similarWords = this.getSimilarWords(term)
      similarWords.forEach((similarWord, index) => {
        const docIds = this.index[similarWord.word] || {}
        Object.keys(docIds).forEach((docId) => {
          seenDocIds.add(docId)

          // compute the score once and store it
          if (!bm25ScoresCache[term]) {
            bm25ScoresCache[term] = this.bm25.getScores([term])
          }

          // if the word from BKTree is the same as the term, it's an exact match
          if (similarWord.word === term) {
            if (!exactScores[docId]) {
              exactScores[docId] = 0
            }
            exactScores[docId] += 0.25 + bm25ScoresCache[term][docId]
          } else {
            // else, it's a fuzzy match
            if (!fuzzyScores[docId]) {
              fuzzyScores[docId] = 0
            }

            fuzzyScores[docId] += 0.125 + bm25ScoresCache[term][docId]

            // if the previous similar word has the same distance, use phonetics to weighten
            if (similarWords[index - 1] && similarWords[index - 1].distance === similarWord.distance) {
              fuzzyScores[docId] *= getPhoneticWeight(term, similarWord.word, this.language.iso2Language)
            }
          }
        })
      })
    })

    // Combine the scores with weights, giving higher weight to exact matches
    const scores = Array.from(seenDocIds).reduce((acc: Record<string, number>, docId) => {
      acc[docId] = (exactScores[docId] || 0) * 1.2 + (fuzzyScores[docId] || 0)

      // Extra weight for matches in the title
      if (this.docMetadata[docId]?.title) {
        const titleWords = this.processText(this.docMetadata[docId].title)
        terms.forEach((term) => {
          if (titleWords.includes(term)) {
            acc[docId] *= 2 // increase score by 100%
          }
        })
      }

      return acc
    }, {})

    // sort the documents by scores in descending order
    const docIds = Object.keys(scores).sort((a, b) => scores[b] - scores[a])

    return docIds.map((docId) => ({
      id: parseInt(docId, 10),
      metadata: this.docMetadata[docId],
      score: scores[docId],
    }))
  }

  getSimilarWords(
    word: string,
    maxDistance: number = 2,
  ): Array<{
    word: string
    distance: number
  }> {
    const similarWords = this.bkTree.search(word, maxDistance)
    // sort the similar words by their distance and map to an array of words
    return similarWords.sort((a, b) => a.distance - b.distance).map((similarWord) => similarWord)
  }

  generateId(text: string) {
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash |= 0
    }
    return hash
  }

  removeDocument(docId: number) {
    if (this.docToWords[docId]) {
      // remove each word in the document from the index
      for (const word of this.docToWords[docId]) {
        delete this.index[word][docId]
        // if there are no more documents for this word, remove the word from the index
        if (Object.keys(this.index[word]).length === 0) {
          delete this.index[word]
          // remove the word from the BK-Tree
          // please note that this operation can be costly
          this.bkTree.remove(word)
        }
      }
    }

    this.vectorizer.removeDocument(docId)

    delete this.documents[docId]
    delete this.docToWords[docId]
  }
}

export const damerauLevenshteinDistance = (s1: string, s2: string) => {
  const dp: number[][] = Array(s1.length + 1)
    .fill(null)
    .map(() => Array(s2.length + 1).fill(0))
  for (let i = 0; i <= s1.length; i++) {
    dp[i][0] = i
  }
  for (let i = 0; i <= s2.length; i++) {
    dp[0][i] = i
  }
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] == s2[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost, // substitution
      )
      if (i > 1 && j > 1 && s1[i - 1] == s2[j - 2] && s1[i - 2] == s2[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + cost) // transposition
      }
    }
  }
  return dp[s1.length][s2.length]
}
