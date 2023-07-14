export class TfidfVectorizer {
  documents: Record<number, string[]>
  ngramRange: [number, number]

  constructor(ngramRange: [number, number] = [1, 1]) {
    this.documents = {}
    this.ngramRange = ngramRange
  }

  addDocument(docId: number, words: string[]) {
    const terms = this.getNgrams(words)
    this.documents[docId] = terms
  }

  removeDocument(docId: number) {
    if (!this.documents.hasOwnProperty(docId)) {
      throw new Error(`Document ${docId} does not exist`)
    }
    delete this.documents[docId]
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

  tf(term: string, document: string[]) {
    let count = 0
    for (let i = 0; i < document.length; i++) {
      if (term === document[i]) {
        count++
      }
    }
    return count > 0 ? 1 + Math.log(count) : 0
  }

  numDocsContaining(term: string) {
    let count = 0
    for (const docId in this.documents) {
      if (this.documents[docId].includes(term)) {
        count++
      }
    }
    return count
  }

  idf(term: string) {
    const numDocs = Object.keys(this.documents).length
    if (numDocs === 0) throw new Error('No documents exist')
    return Math.log(numDocs / (1 + this.numDocsContaining(term)))
  }

  tfidf(term: string, document: string[]) {
    const tfidf = this.tf(term, document) * this.idf(term)
    return tfidf / this.vectorLength(document)
  }

  vectorLength(document: string[]) {
    const tfidfScores = document.map((term) => this.tf(term, document) * this.idf(term))
    const sumSquares = tfidfScores.reduce((sum, score) => sum + score * score, 0)
    return Math.sqrt(sumSquares)
  }
}
