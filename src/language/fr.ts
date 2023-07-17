import { DIACRITICS_FR } from '../diacritics/fr'
import { LanguageSupport } from '../engine'
import { stem_fr } from '../stem/fr'
import { DEFAULT_STOPWORDS_FR } from '../stopwords/fr'
import { tokenize_latin } from '../tokenizer/latin'

export default {
  iso2Language: 'fr',
  stem: stem_fr,
  stopwords: DEFAULT_STOPWORDS_FR,
  tokenizer: tokenize_latin,
  diacritics: DIACRITICS_FR,
} as LanguageSupport
