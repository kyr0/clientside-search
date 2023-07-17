import { DIACRITICS_DE } from '../diacritics/de'
import { LanguageSupport } from '../engine'
import { stem_de } from '../stem/de'
import { DEFAULT_STOPWORDS_DE } from '../stopwords/de'
import { tokenize_latin } from '../tokenizer/latin'

export default {
  iso2Language: 'de',
  stem: stem_de,
  stopwords: DEFAULT_STOPWORDS_DE,
  tokenizer: tokenize_latin,
  diacritics: DIACRITICS_DE,
} as LanguageSupport
