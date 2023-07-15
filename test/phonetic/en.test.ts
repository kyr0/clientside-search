import { doubleMetaphone } from '../../dist/index.esm'

describe('doubleMetaphone function', () => {
  test('should return correct phonetic codes for a single word', () => {
    const result = doubleMetaphone('test')
    expect(result).toEqual('TST|TST')
  })

  test('should handle words with different phonetics', () => {
    const result = doubleMetaphone('gelb')
    expect(result).toEqual('KLP|JLP')
  })

  test('should return empty strings for empty input', () => {
    const result = doubleMetaphone('')
    expect(result).toEqual('|')
  })

  test('should handle words with silent leading consonants', () => {
    const result = doubleMetaphone('gnostic')
    expect(result).toEqual('NSTK|NSTK')
  })

  test('should handle special cases in English', () => {
    const result = doubleMetaphone('thomas')
    expect(result).toEqual('TMS|TMS')
  })

  test('should handle special cases in German', () => {
    const result = doubleMetaphone('müller')
    expect(result).toEqual('MLR|MLR')
  })
})
