export function kolnerPhonetik(word: string): string {
  const replacements: { [key: string]: string } = {
    a: '0',
    e: '0',
    i: '0',
    j: '0',
    o: '0',
    u: '0',
    y: '0',
    b: '1',
    p: '1',
    d: '2',
    t: '2',
    f: '3',
    v: '3',
    w: '3',
    g: '4',
    k: '4',
    q: '4',
    c: '48',
    s: '8',
    z: '8',
    x: '48',
    l: '5',
    m: '6',
    n: '6',
    r: '7',
  }

  let phonetikCode = ''

  for (let i = 0; i < word.length; i++) {
    const char = word[i]
    const nextChar = word[i + 1]

    if (replacements[char]) {
      if (char === 'c') {
        if (i === 0 && ['a', 'h', 'k', 'l', 'o', 'q', 'r', 'u', 'x'].includes(nextChar)) {
          phonetikCode += '4'
        } else if (['s', 'z'].includes(nextChar)) {
          phonetikCode += '8'
        } else {
          phonetikCode += '4'
        }
      } else {
        phonetikCode += replacements[char]
      }
    }
  }

  // Remove duplicate characters
  phonetikCode = phonetikCode
    .split('')
    .filter((char, i, arr) => char !== arr[i + 1])
    .join('')

  // Remove zeros
  phonetikCode = phonetikCode.replace(/0/g, '')

  return phonetikCode
}
