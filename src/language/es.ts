import { LanguageSupport } from '../engine'
import { stem_es } from '../stem/es'
import { DEFAULT_STOPWORDS_ES } from '../stopwords/es'

export default {
  iso2Language: 'es',
  stem: stem_es,
  stopwords: DEFAULT_STOPWORDS_ES,
} as LanguageSupport
