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
  stopwords: Array<string>
  diacritics: Array<string>
  tokenizer: (text: string) => Array<string>
  isLogograhic?: boolean
}

export type Iso2LanguageKey = string

export interface LanguageStopwords {
  [key: Iso2LanguageKey]: Array<string>
}

export const DEFAULT_LANGUAGE: Iso2LanguageKey = 'en'

export type DistanceCache = Map<string, Map<string, number>>

export interface StemmedState {
  s: Array<string> // stemmed text
  m?: any // metadata
}

export interface SimilarWord {
  word: string
  distance: number
}

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
  distanceCache: DistanceCache
  stemCache: Map<string, string>
  stemmedDocuments: Array<StemmedState>
  stemmedMetadata: Record<number, { [metadataKey: string]: Array<string> }>
  ngramRange: [number, number]

  constructor(language: LanguageSupport, ngramRange: [number, number] = [1, 1]) {
    this.index = {}
    this.docToWords = {}
    this.documents = {}
    this.bm25 = new BM25()
    this.language = language
    this.ngramRange = ngramRange
    this.stopWords = new Set(language.stopwords)
    this.vectorizer = new TfidfVectorizer(ngramRange)
    this.distanceCache = new Map()
    this.bkTree = new BKTree(this.distanceCache)
    this.docMetadata = {}
    this.stemCache = new Map()
    this.stemmedDocuments = []
    this.stemmedMetadata = {}
  }

  static fromHydratedState(compressedJSON: any, language: LanguageSupport) {
    const jsonData = JSON.parse(compressedJSON)
    if (jsonData.iso2Language !== language.iso2Language) {
      throw new Error(`Language mismatch: expected ${language.iso2Language} but got ${jsonData.iso2Language} from JSON`)
    }
    const searchEngine = new SearchEngine(language, jsonData.ngramRange)
    searchEngine.stemmedDocuments = jsonData.stemmedDocuments
    searchEngine.stemmedMetadata = jsonData.stemmedMetadata

    for (let i = 0; i < searchEngine.stemmedDocuments.length; i++) {
      const stemmedDocument = searchEngine.stemmedDocuments[i]
      searchEngine.addDocumentStemmed(stemmedDocument.s, i, stemmedDocument.m)
    }
    return searchEngine
  }

  hydrateState() {
    return JSON.stringify({
      stemmedDocuments: this.stemmedDocuments,
      ngramRange: this.ngramRange,
      iso2Language: this.language.iso2Language,
      stemmedMetadata: this.stemmedMetadata,
    })
  }

  static async fromHydratedStateRemote(filePath: string, language: LanguageSupport) {
    try {
      const response = await fetch(filePath)
      const jsonData = await response.text()
      return SearchEngine.fromHydratedState(jsonData, language)
    } catch (error) {
      console.error('Error loading index from compressed JSON:', error)
    }
  }

  getStemmedWord(word: string): string {
    if (!this.stemCache.has(word)) {
      this.stemCache.set(word, this.language.stem(word))
    }
    return this.stemCache.get(word)
  }

  processText(text: string): string[] {
    const words = []
    const rawWords = this.language.tokenizer(text)

    // Japanese and Chinese don't have stopwords
    // nor does the typical character-based approach work for them
    // the simple tokenization is a sliding window multigram approach
    // based evidence gathered from resarch on average word length
    // as there is also no stemming and upper/lower-case, we can early return here
    if (this.language.isLogograhic) {
      return rawWords
    }

    for (const rawWord of rawWords) {
      const word = rawWord.trim().toLowerCase()
      if (word !== '' && !this.stopWords.has(word)) {
        words.push(this.getStemmedWord(word))
      }
    }
    return words
  }

  addDocumentStemmed(words: string[], docId: number, metadata: any = {}) {
    this.bm25.addDocument(words, docId)
    this.vectorizer.addDocument(docId, words)

    const wordsSet = new Set(words)
    const tfidfCache = {}

    wordsSet.forEach((word) => {
      if (!this.index[word]) {
        this.index[word] = {}
      }

      if (!tfidfCache[word]) {
        tfidfCache[word] = this.vectorizer.tfidf(word, docId)
      }

      this.index[word][docId] = tfidfCache[word]
      this.bkTree.insert(word)
    })

    this.docToWords[docId] = Array.from(wordsSet)
    this.docMetadata[docId] = metadata

    return docId
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

      if (!this.stemmedMetadata[docId]) {
        this.stemmedMetadata[docId] = {}
      }
      this.stemmedMetadata[docId][key] = metaWords
      words.push(...metaWords)
    }

    this.stemmedDocuments.push({ s: words, m: metadata })

    return this.addDocumentStemmed(words, docId, metadata)
  }

  search(query: string, topN: number = 10) {
    const terms = this.processText(query)
    const exactScores: Record<string, number> = {}
    const fuzzyScores: Record<string, number> = {}
    const seenDocIds: Set<string> = new Set()
    const bm25ScoresCache: Record<string, any> = {}

    terms.some((term) => {
      const similarWords = this.language.isLogograhic ? [{ word: term, distance: 0 }] : this.getSimilarWords(term)
      similarWords.forEach((similarWord: SimilarWord, index: number) => {
        const docIds = this.index[similarWord.word] || {}
        Object.keys(docIds).forEach((docId) => {
          seenDocIds.add(docId)

          // compute the score once and store it
          if (!bm25ScoresCache[term]) {
            bm25ScoresCache[term] = this.bm25.getScores([term])
          }

          if (similarWord.word === term) {
            if (!exactScores[docId]) {
              exactScores[docId] = 0
            }
            exactScores[docId] += 0.25 + bm25ScoresCache[term][docId]
          } else {
            if (!fuzzyScores[docId]) {
              fuzzyScores[docId] = 0
            }

            fuzzyScores[docId] += 0.125 + bm25ScoresCache[term][docId]

            if (similarWords[index - 1] && similarWords[index - 1].distance === similarWord.distance) {
              fuzzyScores[docId] *= getPhoneticWeight(term, similarWord.word, this.language.iso2Language)
            }
          }
        })

        // early exit if the maximum number of results is reached
        if (seenDocIds.size >= topN) {
          return true
        }
      })

      return false
    })

    // combine the scores with weights, giving higher weight to exact matches
    const scores = Array.from(seenDocIds).reduce((acc: Record<string, number>, docId) => {
      acc[docId] = (exactScores[docId] || 0) * 1.2 + (fuzzyScores[docId] || 0)

      if (this.stemmedMetadata[docId]?.index_title) {
        terms.forEach((term) => {
          if (this.stemmedMetadata[docId]?.index_title.includes(term)) {
            acc[docId] *= 2
          }
        })
      }

      return acc
    }, {})

    const docIds = Object.keys(scores)
      .sort((a, b) => scores[b] - scores[a])
      .slice(0, topN)

    return docIds.map((docId) => ({
      id: parseInt(docId, 10),
      metadata: this.docMetadata[docId],
      score: scores[docId],
    }))
  }

  getSimilarWords(word: string, maxDistance: number = 2): Array<SimilarWord> {
    const similarWords = this.bkTree.search(word, maxDistance)
    // sort the similar words by their distance and map to an array of words
    return similarWords.sort((a, b) => a.distance - b.distance).map((similarWord) => similarWord)
  }

  // a variation of Daniel J. Bernstein string hash function (djb2)
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
  }
}

export const damerauLevenshteinDistance = (s1: string, s2: string, distanceCache: Map<string, Map<string, number>>) => {
  const cacheS1 = distanceCache.get(s1)
  if (cacheS1) {
    const cachedDistance = cacheS1.get(s2)
    if (cachedDistance !== undefined) {
      return cachedDistance
    }
  } else {
    distanceCache.set(s1, new Map<string, number>())
  }

  const len1 = s1.length
  const len2 = s2.length

  const dp: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0))

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

  // store the calculated distance in the cache
  distanceCache.get(s1).set(s2, dp[s1.length][s2.length])

  return dp[s1.length][s2.length]
}
