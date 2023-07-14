import { stem_en } from '../stem/en'
import { DEFAULT_STOPWORDS_EN } from '../stopwords/en'
import { LanguageSupport } from '../engine'

export default {
  iso2Language: 'en',
  stem: stem_en,
  stopwords: DEFAULT_STOPWORDS_EN,
} as LanguageSupport
