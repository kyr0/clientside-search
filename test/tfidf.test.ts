import { TfidfVectorizer } from '../dist/index.esm'

describe('TfidfVectorizer', () => {
  let vectorizer: TfidfVectorizer

  beforeEach(() => {
    vectorizer = new TfidfVectorizer([1, 2])
  })

  it('should add documents correctly', () => {
    vectorizer.addDocument(1, ['a', 'b', 'c'])
    expect(vectorizer.documents[1]).toEqual(['a', 'b', 'c', 'a b', 'b c'])
  })

  it('should remove documents correctly', () => {
    vectorizer.addDocument(1, ['a', 'b', 'c'])
    vectorizer.removeDocument(1)
    expect(vectorizer.documents[1]).toBeUndefined()
  })

  it('should calculate tf correctly', () => {
    const tf = vectorizer.tf('a', ['a', 'b', 'a', 'c', 'a'])
    expect(tf).toBeCloseTo(1 + Math.log(3))
  })

  it('should calculate numDocsContaining correctly', () => {
    vectorizer.addDocument(1, ['a', 'b', 'c'])
    vectorizer.addDocument(2, ['a', 'd', 'e'])
    vectorizer.addDocument(3, ['f', 'g', 'h'])
    const count = vectorizer.numDocsContaining('a')
    expect(count).toBe(2)
  })

  it('should calculate idf correctly', () => {
    const vectorizer = new TfidfVectorizer()
    vectorizer.addDocument(1, ['a', 'b', 'c'])
    vectorizer.addDocument(2, ['a', 'd', 'e'])
    vectorizer.addDocument(3, ['f', 'g', 'h'])
    const idf = vectorizer.idf('a')
    expect(idf).toBeCloseTo(0)
  })

  it('should calculate tfidf correctly', () => {
    const vectorizer = new TfidfVectorizer()
    vectorizer.addDocument(1, ['a', 'b', 'c'])
    vectorizer.addDocument(2, ['a', 'd', 'e'])
    vectorizer.addDocument(3, ['f', 'g', 'h'])
    const tfidf = vectorizer.tfidf('a', ['a', 'b', 'c'])
    const expectedTfidf = (1 + Math.log(1)) * Math.log(3 / (1 + 2))
    expect(tfidf).toBeCloseTo(expectedTfidf)
  })
})
