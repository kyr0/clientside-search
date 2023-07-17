import { LanguageSupport } from '../engine'
import { tokenize_logographic } from '../tokenizer/logographic'

export default {
  iso2Language: 'ja',
  tokenizer: tokenize_logographic('ja'),
  isLogograhic: true,
} as LanguageSupport
