import { German2Stemmer, stem_de } from '../../dist/index.esm'

describe('German2Stemmer Tests', () => {
  let stemmer: German2Stemmer

  beforeEach(() => {
    stemmer = new German2Stemmer()
  })

  test('should correctly stem word with suffix using stem_de', () => {
    const word = 'häuser'
    const expectedStem = 'haus'
    expect(stem_de(word)).toEqual(expectedStem)
  })

  test('should correctly stem word with prefix and suffix', () => {
    const word = 'beziehung'
    const expectedStem = 'bezieh'
    expect(stemmer.stem(word)).toEqual(expectedStem)
  })

  test('should handle special character ß correctly', () => {
    const word = 'straße'
    const expectedStem = 'strass'
    expect(stemmer.stem(word)).toEqual(expectedStem)
  })

  test('should handle umlaut characters correctly', () => {
    const word = 'fräulein'
    const expectedStem = 'fraulein'
    expect(stemmer.stem(word)).toEqual(expectedStem)
  })

  test('should not change short word without suffix', () => {
    const word = 'haus'
    const expectedStem = 'haus'
    expect(stemmer.stem(word)).toEqual(expectedStem)
  })
})
