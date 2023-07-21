import { LanguageSupport } from '../engine'

export const RE_WORD_SPLITTER = /[.,\/;:=\-\(\)’´`′\']/g

export const tokenize_latin = (text: string, language?: LanguageSupport): Array<string> => {
  const words: Array<string> = text.replace(RE_WORD_SPLITTER, ' ').split(' ')
  let lexiconMatches: Array<string> = []

  if (language && Array.isArray(language.lexiconCompoundWords)) {
    words.forEach((word) => {
      language.lexiconCompoundWords.forEach((lexiconWord) => {
        const index = word.indexOf(lexiconWord)
        if (index === 0) {
          if (words.indexOf(lexiconWord) === -1) {
            lexiconMatches.push(lexiconWord)
          }

          const rest = word.slice(index + lexiconWord.length)

          console.log('rest', rest)

          if (rest && rest.length > 1 && words.indexOf(rest) === -1) {
            lexiconMatches.push(word.slice(index + lexiconWord.length))
          }
        }
      })
    })
  }
  return [...words, ...lexiconMatches]
}
