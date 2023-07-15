import { Iso2LanguageKey } from '../engine'
import { koelnerPhonetik } from './de'
import { doubleMetaphone } from './en'
import { spanishMetaphone } from './es'
import { phonetic } from './fr'

const DEFAULT_PHONETIC_ALGORITHMS: {
  [key in Iso2LanguageKey]: PhoneticFn
} = {
  en: doubleMetaphone,
  de: koelnerPhonetik,
  fr: phonetic,
  es: spanishMetaphone,
}

export type PhoneticFn = (word: string) => string

export const getPhoneticWeight = (wordA: string, wordB: string, language: Iso2LanguageKey) => {
  if (!DEFAULT_PHONETIC_ALGORITHMS[language]) return 1
  return DEFAULT_PHONETIC_ALGORITHMS[language](wordA) === DEFAULT_PHONETIC_ALGORITHMS[language](wordB) ? 0.9 : 1.1
}
