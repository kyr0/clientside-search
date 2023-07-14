import { TfidfVectorizer } from '../dist/index.esm'

describe('TfidfVectorizer', () => {
  let vectorizer: TfidfVectorizer

  beforeEach(() => {
    vectorizer = new TfidfVectorizer([1, 1])

    vectorizer.addDocument(1, ['the', 'quick', 'brown', 'fox'])
    vectorizer.addDocument(2, ['jumps', 'over', 'the', 'lazy', 'dog'])
    vectorizer.addDocument(3, ['sun', 'is', 'shining', 'today'])
  })

  describe('tf', () => {
    test('should return the correct term frequency', () => {
      const tfTheDoc1 = vectorizer.tf('the', 1)
      const tfTheDoc2 = vectorizer.tf('the', 2)
      const tfFoxDoc1 = vectorizer.tf('fox', 1)
      const tfFoxDoc2 = vectorizer.tf('fox', 2)

      expect(tfTheDoc1).toBe(1)
      expect(tfTheDoc2).toBe(1)
      expect(tfFoxDoc1).toBe(1)
      expect(tfFoxDoc2).toBe(0)
    })
  })

  describe('tfidf', () => {
    test('should return the correct tf-idf score', () => {
      const tfidfTheDoc1 = vectorizer.tfidf('the', 1)
      const tfidfTheDoc2 = vectorizer.tfidf('the', 2)
      const tfidfFoxDoc1 = vectorizer.tfidf('fox', 1)
      const tfidfSunDoc3 = vectorizer.tfidf('sun', 3)

      expect(tfidfTheDoc1).toBeCloseTo(tfidfTheDoc2, 5)
      expect(tfidfFoxDoc1).toBeCloseTo(0.5773502691896258, 5)
      expect(tfidfSunDoc3).toBeGreaterThan(0)
    })
  })

  describe('addDocument', () => {
    test('should correctly add a document', () => {
      vectorizer.addDocument(4, ['adding', 'another', 'document'])
      const tfAddingDoc4 = vectorizer.tf('adding', 4)
      expect(tfAddingDoc4).toBe(1)
    })
  })

  describe('removeDocument', () => {
    test('should correctly remove a document', () => {
      vectorizer.removeDocument(3)
      expect(() => vectorizer.removeDocument(3)).toThrowError('Document 3 does not exist')
    })
  })

  describe('getNgrams', () => {
    test('should return the correct ngrams', () => {
      const ngrams = vectorizer.getNgrams(['get', 'ngrams', 'test'])
      expect(ngrams).toEqual(['get', 'ngrams', 'test'])
    })
  })

  describe('numDocsContaining', () => {
    test('should return the correct number of documents containing a term', () => {
      const numDocsContainingThe = vectorizer.numDocsContaining('the')
      expect(numDocsContainingThe).toBe(2)
    })
  })

  describe('idf', () => {
    test('should return the correct inverse document frequency', () => {
      const idfThe = vectorizer.idf('the')
      const idfFox = vectorizer.idf('fox')
      expect(idfThe).toBeCloseTo(0, 5)
      expect(idfFox).toBeCloseTo(Math.log(1.5), 5)
    })
  })

  describe('vectorLength', () => {
    test('should return the correct vector length', () => {
      const vectorLengthDoc1 = vectorizer.vectorLength(1)
      expect(vectorLengthDoc1).toBeGreaterThan(0)
    })
  })
})
