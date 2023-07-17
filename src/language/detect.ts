import { StopwordSets, stopwordSets } from './../detect/latin'
import { detectLogographicLanguage } from '../detect/logographic'
import { detectLanguageLatin } from '../detect/latin'
import { Iso2LanguageKey } from '../engine'

export const detectLanguage = (text: string, stopwords: StopwordSets = stopwordSets): Iso2LanguageKey => {
  const iso2LanguageLatin = detectLanguageLatin(text, stopwords)
  const iso2LanguageLogographic = detectLogographicLanguage(text)
  return iso2LanguageLogographic.language === 'latin' ? iso2LanguageLatin : iso2LanguageLogographic.language
}
