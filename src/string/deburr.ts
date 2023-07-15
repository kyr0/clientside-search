import { deburredLetters } from '../data/deburred'

const reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g
const rsComboMarksRange = '\\u0300-\\u036f'
const reComboHalfMarksRange = '\\ufe20-\\ufe2f'
const rsComboSymbolsRange = '\\u20d0-\\u20ff'
const rsComboMarksExtendedRange = '\\u1ab0-\\u1aff'
const rsComboMarksSupplementRange = '\\u1dc0-\\u1dff'
const rsComboRange =
  rsComboMarksRange +
  reComboHalfMarksRange +
  rsComboSymbolsRange +
  rsComboMarksExtendedRange +
  rsComboMarksSupplementRange
const rsCombo = `[${rsComboRange}]`
const reComboMark = RegExp(rsCombo, 'g')

const deburrLetter = (key: string) => deburredLetters[key]

export function deburr(string: string): string {
  return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '')
}
