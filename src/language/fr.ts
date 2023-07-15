import { LanguageSupport } from '../engine'
import { stem_fr } from '../stem/fr'
import { DEFAULT_STOPWORDS_FR } from '../stopwords/fr'

export default {
  iso2Language: 'fr',
  stem: stem_fr,
  stopwords: DEFAULT_STOPWORDS_FR,
} as LanguageSupport
