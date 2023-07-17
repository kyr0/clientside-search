import { DIACRITICS_DE } from '../diacritics/de'
import { DIACRITICS_ES } from '../diacritics/es'
import { DIACRITICS_FR } from '../diacritics/fr'
import { LanguageStopwords, Iso2LanguageKey, DEFAULT_LANGUAGE } from '../engine'
import { DEFAULT_STOPWORDS_DE } from '../stopwords/de'
import { DEFAULT_STOPWORDS_EN } from '../stopwords/en'
import { DEFAULT_STOPWORDS_ES } from '../stopwords/es'
import { DEFAULT_STOPWORDS_FR } from '../stopwords/fr'
import { tokenize_latin } from '../tokenizer/latin'

export type StopwordSets = { [key in Iso2LanguageKey]: Set<string> }

export const DEFAULT_STOPWORDS: LanguageStopwords = {
  de: DEFAULT_STOPWORDS_DE,
  en: DEFAULT_STOPWORDS_EN,
  fr: DEFAULT_STOPWORDS_FR,
  es: DEFAULT_STOPWORDS_ES,
}

export const DEFAULT_DIACRITICS = {
  en: [],
  de: DIACRITICS_DE,
  fr: DIACRITICS_FR,
  es: DIACRITICS_ES,
}

export const stopwordSets: StopwordSets = {
  de: new Set(DEFAULT_STOPWORDS.de.map((word) => word.toLowerCase())),
  en: new Set(DEFAULT_STOPWORDS.en.map((word) => word.toLowerCase())),
  fr: new Set(DEFAULT_STOPWORDS.fr.map((word) => word.toLowerCase())),
  es: new Set(DEFAULT_STOPWORDS.es.map((word) => word.toLowerCase())),
}

export const detectLanguageLatin = (text: string, stopwords: StopwordSets = stopwordSets): Iso2LanguageKey => {
  let detectedLanguage = DEFAULT_LANGUAGE

  const words = tokenize_latin(text.toLowerCase())
  const counts: Partial<Record<Iso2LanguageKey, number>> = {}
  const languages = Object.keys(stopwords) as Array<Iso2LanguageKey>

  for (const word of words) {
    for (const lang of languages) {
      if (stopwords[lang].has(word)) {
        counts[lang] = (counts[lang] || 0) + 1
      }
    }
  }

  let maxCount = 0
  for (const lang of languages) {
    if ((counts[lang] || 0) > maxCount) {
      maxCount = counts[lang]!
      detectedLanguage = lang
    }
  }

  // count the occurrence of diacritics in the text
  const diacriticCounts: Partial<Record<Iso2LanguageKey, number>> = {}
  let foundDiacritic = false
  for (const lang of languages) {
    diacriticCounts[lang] = 0
    for (const char of DEFAULT_DIACRITICS[lang] || []) {
      let count = (text.match(new RegExp(char, 'g')) || []).length
      diacriticCounts[lang] += count
      if (diacriticCounts[lang] > 0) {
        detectedLanguage = lang
        foundDiacritic = true
        break
      }
    }
    if (foundDiacritic) break
  }
  return detectedLanguage
}
