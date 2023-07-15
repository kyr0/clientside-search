import { LanguageStopwords, Iso2LanguageKey, DEFAULT_LANGUAGE, RE_WORD_SPLITTER } from '../engine'
import { DEFAULT_STOPWORDS_DE } from '../stopwords/de'
import { DEFAULT_STOPWORDS_EN } from '../stopwords/en'
import { DEFAULT_STOPWORDS_FR } from '../stopwords/fr'

type StopwordSets = { [key in Iso2LanguageKey]: Set<string> }

const DEFAULT_STOPWORDS: LanguageStopwords = {
  de: DEFAULT_STOPWORDS_DE,
  en: DEFAULT_STOPWORDS_EN,
  fr: DEFAULT_STOPWORDS_FR,
}

const stopwordSets: StopwordSets = {
  de: new Set(DEFAULT_STOPWORDS.de.map((word) => word.toLowerCase())),
  en: new Set(DEFAULT_STOPWORDS.en.map((word) => word.toLowerCase())),
  fr: new Set(DEFAULT_STOPWORDS.fr.map((word) => word.toLowerCase())),
}

export const detectLanguage = (text: string, stopwords: StopwordSets = stopwordSets): Iso2LanguageKey => {
  const words = text.toLowerCase().replace(RE_WORD_SPLITTER, ' ').split(' ')
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
  let detectedLanguage = DEFAULT_LANGUAGE
  for (const lang of languages) {
    if ((counts[lang] || 0) > maxCount) {
      maxCount = counts[lang]!
      detectedLanguage = lang
    }
  }
  return detectedLanguage
}
