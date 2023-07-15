import { phonetic } from '../../dist/phonetic.esm'

describe('squeeze', () => {
  it('should handle empty string', () => {
    expect(phonetic('')).toBe('')
  })

  it('should handle single letter', () => {
    expect(phonetic('a')).toBe('A')
  })

  it('should handle capital letters', () => {
    expect(phonetic('ABC')).toBe('ABC')
  })

  it('should handle single word', () => {
    expect(phonetic('Bonjour')).toBe('BONJOUR')
  })

  it('should handle single word with accent', () => {
    expect(phonetic('Éclair')).toBe('EKLAIR')
  })

  it('should handle similar sounding words', () => {
    expect(phonetic('sot')).toBe(phonetic('seau'))
  })

  it('should handle similar sounding words with different spelling', () => {
    expect(phonetic('cœur')).toBe(phonetic('keur'))
  })

  it('should handle similar sounding words with special characters', () => {
    expect(phonetic('étudiant')).toBe(phonetic('etudian'))
  })

  it('should handle words with silent letters', () => {
    expect(phonetic('temps')).toBe(phonetic('tan'))
  })

  it('should handle words with nasal vowels', () => {
    expect(phonetic('tante')).toBe(phonetic('tente'))
  })

  it('should handle words with y', () => {
    expect(phonetic('yeux')).toBe(phonetic('ieux'))
  })

  it('should handle words with similar sounding endings', () => {
    expect(phonetic('manger')).toBe(phonetic('MANJ'))
  })

  it('should handle words with œ', () => {
    expect(phonetic('sœur')).toBe(phonetic('seur'))
  })
})
