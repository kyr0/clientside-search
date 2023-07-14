export class BM25 {
  private documents: Map<number, string[]>
  private averageLength: number
  private k1: number
  private b: number
  private docFrequency: Map<string, number>
  private termFrequency: Map<string, Map<number, number>>

  constructor(k1 = 1.5, b = 0.75) {
    this.documents = new Map()
    this.averageLength = 0
    this.k1 = k1
    this.b = b
    this.docFrequency = new Map()
    this.termFrequency = new Map()
  }

  toJSON() {
    return {
      documents: Array.from(this.documents.entries()),
      averageLength: this.averageLength,
      k1: this.k1,
      b: this.b,
      docFrequency: Array.from(this.docFrequency.entries()),
      termFrequency: Array.from(this.termFrequency.entries()).map(([term, freqMap]) => [
        term,
        Array.from(freqMap.entries()),
      ]),
    }
  }

  static fromJSON(json: any) {
    const bm25 = new BM25(json.k1, json.b)
    bm25.documents = new Map(json.documents)
    bm25.averageLength = json.averageLength
    bm25.docFrequency = new Map(json.docFrequency)
    bm25.termFrequency = new Map(json.termFrequency.map(([term, freqMap]: [string, any[]]) => [term, new Map(freqMap)]))
    return bm25
  }

  addDocument(doc: string[], docId: number) {
    this.documents.set(docId, doc)
    let totalLength = this.averageLength * (this.documents.size - 1)
    totalLength += doc.length
    this.averageLength = totalLength / this.documents.size
    doc.forEach((term) => {
      this.docFrequency.set(term, (this.docFrequency.get(term) || 0) + 1)
      let termFreq = this.termFrequency.get(term)
      if (!termFreq) {
        termFreq = new Map()
        this.termFrequency.set(term, termFreq)
      }
      termFreq.set(docId, (termFreq.get(docId) || 0) + 1)
    })
  }

  score(query: string[], doc: string[], docId: number) {
    let score = 0
    query.forEach((term) => {
      const docFreq = this.docFrequency.get(term)
      if (docFreq) {
        const tf = this.termFrequency.get(term)?.get(docId) || 0
        const idf = Math.log((this.documents.size - docFreq + 0.5) / (docFreq + 0.5))
        const norm = (tf * (this.k1 + 1)) / (tf + this.k1 * (1 - this.b + (this.b * doc.length) / this.averageLength))
        score += idf * norm
      }
    })
    return score
  }

  getScores(query: string[]) {
    const scores: Record<number, number> = {}
    this.documents.forEach((doc, docId) => {
      scores[docId] = this.score(query, doc, docId)
    })
    return scores
  }

  getScoresForSubset(query: string[], docIds: number[]) {
    const scores: Record<number, number> = {}
    docIds.forEach((docId) => {
      const doc = this.documents.get(docId)
      if (doc) {
        scores[docId] = this.score(query, doc, docId)
      }
    })
    return scores
  }
}
