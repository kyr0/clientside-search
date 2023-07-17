export const RE_WORD_SPLITTER = /[.,\/#!$%\^&\*;:{}=\-_~()’´`′\'。、]/g

export const tokenize_latin = (text: string): Array<string> => text.replace(RE_WORD_SPLITTER, ' ').split(' ')
