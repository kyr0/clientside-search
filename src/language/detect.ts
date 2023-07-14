import { LanguageStopwords, Iso2LanguageKey, DEFAULT_LANGUAGE } from '../engine'
import { DEFAULT_STOPWORDS_DE } from '../stopwords/de'
import { DEFAULT_STOPWORDS_EN } from '../stopwords/en'

export const DEFAULT_STOPWORDS: LanguageStopwords = {
  de: DEFAULT_STOPWORDS_DE,
  en: DEFAULT_STOPWORDS_EN,
}

// simple statistical language detection
export const detectLanguage = (text: string, stopwords: LanguageStopwords = DEFAULT_STOPWORDS): Iso2LanguageKey => {
  const words = text.split(/\s+/)
  const counts: Partial<Record<Iso2LanguageKey, number>> = {}

  for (const word of words) {
    for (const lang in stopwords) {
      if (stopwords[lang].includes(word)) {
        if (counts[lang]) {
          counts[lang]! += 1
        } else {
          counts[lang] = 1
        }
      }
    }
  }

  let maxCount = 0
  let detectedLanguage = DEFAULT_LANGUAGE
  for (const lang in counts) {
    if (counts[lang]! > maxCount) {
      maxCount = counts[lang]!
      detectedLanguage = lang
    }
  }
  return detectedLanguage
}
