import { LanguageSupport } from '../engine'
import { DEFAULT_STOPWORDS_JA } from '../stopwords/ja'
import { tokenize_logographic } from '../tokenizer/logographic'

export default {
  iso2Language: 'ja',
  stopwords: DEFAULT_STOPWORDS_JA,
  tokenizer: tokenize_logographic('ja'),
  isLogograhic: true,
} as LanguageSupport
