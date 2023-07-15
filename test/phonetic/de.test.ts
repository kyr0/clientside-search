import { koelnerPhonetik } from '../../dist/phonetic.esm'

describe('koelnerPhonetik function', () => {
  test('should return correct phonetic code for a single word', () => {
    expect(koelnerPhonetik('test')).toEqual('282')
    expect(koelnerPhonetik('phonetisch')).toEqual('16284')
    expect(koelnerPhonetik('köln')).toEqual('456')
  })

  test('should return empty string for empty input', () => {
    expect(koelnerPhonetik('')).toEqual('')
  })

  test('should handle special case for "c" at the start of a word', () => {
    expect(koelnerPhonetik('chance')).toEqual('464')
    expect(koelnerPhonetik('clown')).toEqual('4536')
    expect(koelnerPhonetik('computer')).toEqual('46127')
  })

  test('should handle special case for "c" followed by "s" or "z"', () => {
    expect(koelnerPhonetik('zugriff')).toEqual('8473')
    expect(koelnerPhonetik('szene')).toEqual('86')
  })

  test('should ignore characters not in replacements map', () => {
    expect(koelnerPhonetik('h')).toEqual('')
    expect(koelnerPhonetik('!@#$%^&*()')).toEqual('')
  })

  test('should remove duplicate characters', () => {
    expect(koelnerPhonetik('bettel')).toEqual('125')
    expect(koelnerPhonetik('tisch')).toEqual('284')
  })

  test('should remove zeros from the result', () => {
    expect(koelnerPhonetik('eule')).toEqual('5')
    expect(koelnerPhonetik('uhr')).toEqual('7')
  })
})
