export const tokenizeNGram = (input: string, n: number[], singleCharacterWords: Set<string> = new Set()): string[] => {
  let tokens: string[] = []
  for (let j = 0; j < n.length; j++) {
    for (let i = 0; i < input.length - n[j] + 1; i++) {
      const token = input.slice(i, i + n[j])
      if (n[j] > 1 || singleCharacterWords.has(token)) {
        tokens.push(token)
      }
    }
  }
  return tokens
}
