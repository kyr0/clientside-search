import { stem_en } from '../stem/en'
import { DEFAULT_STOPWORDS_EN } from '../stopwords/en'
import { LanguageSupport } from '../engine'
import { tokenize_latin } from '../tokenizer/latin'
import lexiconCompoundWords from '../lexicon/en/compound_words.json'

export default {
  iso2Language: 'en',
  stem: stem_en,
  stopwords: DEFAULT_STOPWORDS_EN,
  tokenizer: tokenize_latin,
  diacritics: [],
  lexiconCompoundWords,
} as LanguageSupport
