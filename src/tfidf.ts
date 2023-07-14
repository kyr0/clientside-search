type TermFrequency = Record<string, number>
type DocumentTerms = Record<number, Set<string>>
type DocumentTermFrequencies = Record<number, TermFrequency>
type VectorLengths = Record<number, number | undefined>

export class TfidfVectorizer {
  documents: DocumentTerms
  termFrequencies: DocumentTermFrequencies
  ngramRange: [number, number]
  idfCache: Record<string, number | undefined>
  vectorLengths: VectorLengths

  constructor(ngramRange: [number, number] = [1, 1]) {
    this.documents = {}
    this.termFrequencies = {}
    this.ngramRange = ngramRange
    this.idfCache = {}
    this.vectorLengths = {}
  }

  addDocument(docId: number, words: string[]) {
    const terms = this.getNgrams(words)
    this.documents[docId] = new Set(terms)

    const termFrequency: TermFrequency = {}
    terms.forEach((term) => {
      termFrequency[term] = termFrequency[term] ? termFrequency[term] + 1 : 1
    })
    this.termFrequencies[docId] = termFrequency
    this.idfCache = {} // invalidate idf cache
    delete this.vectorLengths[docId] // invalidate vector length cache for this document
  }

  removeDocument(docId: number) {
    if (!this.documents.hasOwnProperty(docId)) {
      throw new Error(`Document ${docId} does not exist`)
    }
    delete this.documents[docId]
    delete this.termFrequencies[docId]
    this.idfCache = {} // invalidate idf cache
    delete this.vectorLengths[docId] // invalidate vector length cache for this document
  }

  getNgrams(terms: string[]) {
    let ngrams = []
    for (let i = this.ngramRange[0]; i <= this.ngramRange[1]; i++) {
      for (let j = 0; j <= terms.length - i; j++) {
        ngrams.push(terms.slice(j, j + i).join(' '))
      }
    }
    return ngrams
  }

  tf(term: string, docId: number) {
    if (!this.termFrequencies[docId]) {
      return 0
    }
    return this.termFrequencies[docId][term] || 0
  }

  numDocsContaining(term: string) {
    let count = 0
    for (const docId in this.documents) {
      if (this.documents[docId].has(term)) {
        count++
      }
    }
    return count
  }

  idf(term: string) {
    if (this.idfCache[term] !== undefined) {
      return this.idfCache[term]
    }

    const numDocs = Object.keys(this.documents).length
    if (numDocs === 0) throw new Error('No documents exist')

    const idf = Math.log(numDocs / (1 + this.numDocsContaining(term)))
    this.idfCache[term] = idf
    return idf
  }

  tfidf(term: string, docId: number) {
    const tfidf = this.tf(term, docId) * this.idf(term)
    return tfidf / this.vectorLength(docId)
  }

  vectorLength(docId: number) {
    if (this.vectorLengths[docId] !== undefined) {
      return this.vectorLengths[docId]
    }

    const tfidfScores = Array.from(this.documents[docId]).map((term) => this.tf(term, docId) * this.idf(term))
    const sumSquares = tfidfScores.reduce((sum, score) => sum + score * score, 0)
    const length = Math.sqrt(sumSquares)

    this.vectorLengths[docId] = length
    return length
  }
}
