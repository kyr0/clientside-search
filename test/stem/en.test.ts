import { EnglishStemmer, stem_en } from '../../dist/stem.esm'

describe('EnglishStemmer Tests', () => {
  let stemmer: EnglishStemmer

  beforeEach(() => {
    stemmer = new EnglishStemmer()
  })

  test('should correctly stem word with suffix using stem_en', () => {
    const word = 'houses'
    const expectedStem = 'hous'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem word with prefix and suffix', () => {
    const word = 'relationship'
    const expectedStem = 'relationship'
    expect(stemmer.stem(word)).toEqual(expectedStem)
  })

  test('should handle special character é correctly', () => {
    const word = 'résumé'
    const expectedStem = 'résumé'
    expect(stemmer.stem(word)).toEqual(expectedStem)
  })

  test('should handle word with apostrophe correctly', () => {
    const word = "it's"
    const expectedStem = 'it'
    expect(stemmer.stem(word)).toEqual(expectedStem)
  })

  test('should not change short word without suffix', () => {
    const word = 'house'
    const expectedStem = 'hous'
    expect(stemmer.stem(word)).toEqual(expectedStem)
  })

  test('should correctly stem verb with "-ing" ending', () => {
    const word = 'running'
    const expectedStem = 'run'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem verb with "-ed" ending', () => {
    const word = 'stopped'
    const expectedStem = 'stop'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem adjective with "-est" ending', () => {
    const word = 'strongest'
    const expectedStem = 'strongest'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem adjective with "-er" ending', () => {
    const word = 'bigger'
    const expectedStem = 'bigger'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem word with "-s" ending', () => {
    const word = 'cats'
    const expectedStem = 'cat'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem word with "-ies" ending', () => {
    const word = 'puppies'
    const expectedStem = 'puppi'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem word with "-ation" ending', () => {
    const word = 'examination'
    const expectedStem = 'examin'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem word with "-ness" ending', () => {
    const word = 'happiness'
    const expectedStem = 'happi'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem word with "-ment" ending', () => {
    const word = 'arrangement'
    const expectedStem = 'arrang'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem word with "-ful" ending', () => {
    const word = 'careful'
    const expectedStem = 'care'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem word with "-less" ending', () => {
    const word = 'careless'
    const expectedStem = 'careless'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem word with "-ly" ending', () => {
    const word = 'quickly'
    const expectedStem = 'quick'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem word with "-able" ending', () => {
    const word = 'comfortable'
    const expectedStem = 'comfort'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem word with "-ible" ending', () => {
    const word = 'incredible'
    const expectedStem = 'incred'
    expect(stem_en(word)).toEqual(expectedStem)
  })

  test('should correctly stem word with "-hood" ending', () => {
    const word = 'brotherhood'
    const expectedStem = 'brotherhood'
    expect(stem_en(word)).toEqual(expectedStem)
  })
})
