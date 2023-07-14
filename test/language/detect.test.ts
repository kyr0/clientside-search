import { DEFAULT_LANGUAGE } from '../../dist/index.esm'
import { detectLanguage } from '../../dist/language-detect.esm'

describe('Language Detection', () => {
  test('detects English text', () => {
    const text = 'this is a simple test that should be identified as English'
    const language = detectLanguage(text)
    expect(language).toBe('en')
  })

  test('detects German text', () => {
    const text = 'das ist ein einfacher Test, der als Deutsch identifiziert werden sollte'
    const language = detectLanguage(text)
    expect(language).toBe('de')
  })

  test('defaults to English when no stopword is found', () => {
    const text = 'fubar snafu'
    const language = detectLanguage(text)
    expect(language).toBe(DEFAULT_LANGUAGE)
  })

  test('works with custom stopwords', () => {
    const text = 'fubar snafu'
    const stopwordsSets = {
      custom: new Set(['fubar', 'snafu']),
    }
    const language = detectLanguage(text, stopwordsSets)
    expect(language).toBe('custom')
  })

  test('returns language with the most stopwords in multi-lingual case', () => {
    const text = 'this is a simple test with german: das ist ein einfacher Test'
    const language = detectLanguage(text)
    expect(language).toBe('en')
  })

  test('works with special characters', () => {
    const text = 'déjà vu'
    const stopwordSets = {
      fr: new Set(['déjà', 'vu']),
    }
    const language = detectLanguage(text, stopwordSets)
    expect(language).toBe('fr')
  })

  test('works with upper and lower case', () => {
    const text = 'THIS IS A SIMPLE TEST THAT SHOULD BE IDENTIFIED AS ENGLISH'
    const language = detectLanguage(text)
    expect(language).toBe('en')
  })
})
