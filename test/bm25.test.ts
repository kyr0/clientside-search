import { BM25 } from '../dist/index.esm'

describe('BM25', () => {
  let bm25: BM25

  beforeEach(() => {
    bm25 = new BM25()
  })

  it('should construct with default parameters', () => {
    expect(bm25).toBeInstanceOf(BM25)
  })

  it('should add documents correctly', () => {
    const document = ['hello', 'world']
    bm25.addDocument(document, 1)
    expect(bm25.toJSON()).toMatchObject({
      documents: [[1, document]],
      averageLength: document.length,
    })
  })

  it('should calculate scores correctly', () => {
    const document1 = ['hello', 'world']
    const document2 = ['hello', 'universe']
    bm25.addDocument(document1, 1)
    bm25.addDocument(document2, 2)

    const scores = bm25.getScores(['hello'])

    expect(scores[1]).toBeCloseTo(-1.609)
    expect(scores[2]).toBeCloseTo(-1.609)
  })

  it('should serialize to JSON and back', () => {
    const document = ['hello', 'world']
    bm25.addDocument(document, 1)

    const json = JSON.stringify(bm25.toJSON())
    const newBm25 = BM25.fromJSON(JSON.parse(json))

    expect(newBm25.toJSON()).toEqual(bm25.toJSON())
  })

  it('should handle non-existing terms in score calculation', () => {
    const document = ['hello', 'world']
    bm25.addDocument(document, 1)

    const score = bm25.score(['nonexistent'], 1)
    expect(score).toEqual(0)
  })

  it('should handle non-existing documents in score calculation', () => {
    const document = ['hello', 'world']
    bm25.addDocument(document, 1)

    expect(() => bm25.score(['hello'], 2)).toThrow()
  })

  it('should adjust average length when adding documents', () => {
    const document1 = ['hello', 'world']
    const document2 = ['hello', 'universe', 'and', 'everyone']
    bm25.addDocument(document1, 1)
    bm25.addDocument(document2, 2)

    expect(bm25.toJSON().averageLength).toEqual((document1.length + document2.length) / 2)
  })
})
