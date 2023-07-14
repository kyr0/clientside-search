import { LanguageSupport } from '../engine'
import { stem_de } from '../stem/de'
import { DEFAULT_STOPWORDS_DE } from '../stopwords/de'

export default {
  iso2Language: 'de',
  stem: stem_de,
  stopwords: DEFAULT_STOPWORDS_DE,
} as LanguageSupport
