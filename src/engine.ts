import { BKTree } from './bktree'
import { BM25 } from './bm25'
import { getPhoneticWeight } from './phonetic/phonetic'
import { TfidfVectorizer } from './tfidf'
import { Trie } from './trie'

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

export type Strategy = 'distance' | 'position'

export class SearchEngine {
  strategy: Strategy
  index: Record<string, Record<string, number>>
  docToWords: Record<string, string[]>
  documents: Record<string, string>
  vectorizer: TfidfVectorizer
  bkTree: BKTree
  trie: Trie
  stopWords: Set<string>
  bm25: BM25
  docMetadata: Record<string, any>
  language: LanguageSupport
  distanceCache: DistanceCache
  stemCache: Map<string, string>
  stemmedDocuments: Array<StemmedState>
  stemmedMetadata: Record<number, { [metadataKey: string]: Array<string> }>
  ngramRange: [number, number]

  constructor(language: LanguageSupport, strategy: Strategy = 'distance', ngramRange: [number, number] = [1, 1]) {
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
    this.strategy = strategy
    this.trie = new Trie()
  }

  static fromHydratedState(compressedJSON: string, language: LanguageSupport) {
    const jsonData = JSON.parse(compressedJSON)
    if (jsonData.iso2Language !== language.iso2Language) {
      throw new Error(`Language mismatch: expected ${language.iso2Language} but got ${jsonData.iso2Language} from JSON`)
    }
    const searchEngine = new SearchEngine(language, jsonData.strategy, jsonData.ngramRange)
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
      strategy: this.strategy,
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

  processText(text: string): Array<string> {
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

      // we want to index words that are combined with "-" both as separate words
      // and as combined words, to match both "e-mail", "email" and "e mail"
      if (word.indexOf('-') > -1) {
        const parts = word.split('-')
        parts.forEach((part) => {
          if (part !== '') {
            words.push(this.getStemmedWord(part))
          }
        })
      }

      if (word !== '' && !this.stopWords.has(word)) {
        words.push(this.getStemmedWord(word))
      }
    }
    return words
  }
  addDocumentStemmed(words: string[], docId: number, metadata: any = {}) {
    const { strategy } = this

    this.bm25.addDocument(words, docId)

    if (strategy === 'distance') {
      this.vectorizer.addDocument(docId, words)
    }

    const wordsSet = new Set(words)
    const tfidfCache = strategy === 'distance' ? {} : Object.create(null)

    for (const word of wordsSet) {
      if (!this.index[word]) {
        this.index[word] = {}
      }

      if (strategy === 'distance') {
        if (!tfidfCache[word]) {
          tfidfCache[word] = this.vectorizer.tfidf(word, docId)
        }
        this.index[word][docId] = tfidfCache[word]
        this.bkTree.insert(word)
      } else {
        if (!this.index[word][docId]) {
          this.index[word][docId] = 0
          this.trie.insert(word)
        }
      }
    }

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
  search(query: string, topN?: number) {
    const terms = this.processText(query)
    const exactScores: Record<string, number> = {}
    const fuzzyScores: Record<string, number> = {}
    const partialScores: Record<string, number> = {}
    const seenDocIds: Set<string> = new Set()
    const scoreReason: Record<string, any> = {}

    const bm25ScoresCache: Record<string, any> = terms.reduce((cache, term) => {
      cache[term] = this.bm25.getScores([term])
      return cache
    }, {})

    terms.some((term) => {
      const similarWords = this.language.isLogograhic ? [{ word: term, distance: 0 }] : this.getSimilarWords(term)
      similarWords.forEach((similarWord: SimilarWord, index: number) => {
        const docIds = this.index[similarWord.word] || {}
        const bm25Score = bm25ScoresCache[term]
        Object.keys(docIds).forEach((docId) => {
          seenDocIds.add(docId)

          scoreReason[docId] =
            scoreReason[docId] ||
            (similarWord.word === term ? 'exact' : similarWord.word.indexOf(term) > -1 ? 'partial' : 'fuzzy')

          if (scoreReason[docId] === 'exact') {
            exactScores[docId] = (exactScores[docId] || 0) + 0.25 + bm25Score[docId]
          } else if (scoreReason[docId] === 'partial') {
            partialScores[docId] = (partialScores[docId] || 0) + 0.2 + bm25Score[docId]
          } else {
            fuzzyScores[docId] =
              (fuzzyScores[docId] || 0) +
              (0.125 + bm25Score[docId]) * (similarWord.distance ? 1 / similarWord.distance : 1)

            if (similarWords[index - 1] && similarWords[index - 1].distance === similarWord.distance) {
              fuzzyScores[docId] *= getPhoneticWeight(term, similarWord.word, this.language.iso2Language)
            }
          }
        })
      })
      return false
    })

    let minScore = Infinity,
      maxScore = -Infinity
    const preScores = Array.from(seenDocIds).reduce((acc: Record<string, number>, docId) => {
      let score = (exactScores[docId] || 0) * 1.2 + (partialScores[docId] || 0) * 1.1 + (fuzzyScores[docId] || 0)
      const stemmedMetadataTitle = this.stemmedMetadata[docId]?.index_title
      if (stemmedMetadataTitle) {
        for (let i = 0; i < terms.length; i++) {
          if (stemmedMetadataTitle.includes(terms[i])) {
            score *= 1.1
            break
          }
        }
      }
      acc[docId] = score
      minScore = Math.min(minScore, score)
      maxScore = Math.max(maxScore, score)
      return acc
    }, {})

    const scores = Object.keys(preScores).reduce((acc: Record<string, number>, docId) => {
      const score = preScores[docId]
      acc[docId] =
        maxScore - minScore === 0
          ? 1
          : (Math.max(minScore, Math.min(maxScore, score)) - minScore) / (maxScore - minScore)
      return acc
    }, {})

    let docIds = Object.keys(scores).sort((a, b) => scores[b] - scores[a])

    // Apply the topN restriction only when it's defined
    if (topN !== undefined) {
      docIds = docIds.slice(0, topN)
    }

    return docIds.map((docId) => ({
      id: parseInt(docId, 10),
      metadata: this.docMetadata[docId],
      match: scoreReason[docId],
      score: scores[docId],
    }))
  }

  getSimilarWords(word: string, maxDistance: number = 2): Array<SimilarWord> {
    // when a word has a small length distance values can distord the results
    // we need to clamp the max distance to subtract the word length, leaving a small ratio for mistypes
    if (word.length <= maxDistance) {
      maxDistance = maxDistance - word.length
    }

    if (this.strategy === 'distance') {
      const similarWords = this.bkTree.search(word, maxDistance)
      const similarPartials = this.bkTree.searchPartial(word, maxDistance)

      // sort the similar words by their distance and map to an array of words
      return [...similarWords, ...similarPartials].sort((a, b) => a.distance - b.distance)
    } else {
      return this.trie.search(word).map((word) => ({ word, distance: 0 }))
    }
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

          this.strategy === 'distance' ? this.bkTree.remove(word) : this.trie.delete(word)
        }
      }
    }

    this.strategy === 'distance' && this.vectorizer.removeDocument(docId)

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
