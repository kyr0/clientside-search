import { DIACRITICS_ES } from '../diacritics/es'
import { LanguageSupport } from '../engine'
import { stem_es } from '../stem/es'
import { DEFAULT_STOPWORDS_ES } from '../stopwords/es'
import { tokenize_latin } from '../tokenizer/latin'

export default {
  iso2Language: 'es',
  stem: stem_es,
  stopwords: DEFAULT_STOPWORDS_ES,
  tokenizer: tokenize_latin,
  diacritics: DIACRITICS_ES,
} as LanguageSupport
