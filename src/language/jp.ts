import { LanguageSupport } from '../engine'
import { stem_jp } from '../stem/jp'
import { DEFAULT_STOPWORDS_JP } from '../stopwords/jp'

// experimental
export default {
  iso2Language: 'jp',
  stem: stem_jp,
  stopwords: DEFAULT_STOPWORDS_JP,
} as LanguageSupport
