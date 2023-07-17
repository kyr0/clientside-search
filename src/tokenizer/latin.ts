export const RE_WORD_SPLITTER = /[.,\/;:=\(\)’´`′\']/g

export const tokenize_latin = (text: string): Array<string> => text.replace(RE_WORD_SPLITTER, ' ').split(' ')
