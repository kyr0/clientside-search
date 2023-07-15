import { Iso2LanguageKey, getPhoneticWeight } from '../../dist/index.esm'

describe('getPhoneticWeight', () => {
  it('should return 1 if language is not supported', () => {
    expect(getPhoneticWeight('apple', 'banana', 'xx' as Iso2LanguageKey)).toBe(1)
  })

  it('should return 0.9 if phonetic weight is the same for both words', () => {
    expect(getPhoneticWeight('apple', 'aapple', 'en')).toBe(0.9)
    expect(getPhoneticWeight('apfel', 'aapfel', 'de')).toBe(0.9)
  })

  it('should return 1.1 if phonetic weight is different for the words', () => {
    expect(getPhoneticWeight('apple', 'banana', 'en')).toBe(1.1)
    expect(getPhoneticWeight('apfel', 'birne', 'de')).toBe(1.1)
  })
})
