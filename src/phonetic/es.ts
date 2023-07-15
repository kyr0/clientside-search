const VOWELS = ['A', 'E', 'I', 'O', 'U']

function isStartOfAnyGivenSubstring(
  inputString: string,
  start: number,
  stringLength: number,
  subStrings: string[],
): number {
  if (start < 0 || start >= inputString.length) {
    return 0
  }
  return subStrings.some(
    (subStr) => inputString.indexOf(subStr, start) >= 0 && inputString.indexOf(subStr, start) < start + stringLength,
  )
    ? 1
    : 0
}

function isVowelInPosition(inputString: string, pos: number): boolean {
  return VOWELS.includes(inputString.charAt(pos))
}

function replaceSpanishCharacters(inputStr: string): string {
  return inputStr
    ? inputStr
        .replace('á', 'A')
        .replace('ch', 'X')
        .replace('ç', 'S')
        .replace('é', 'E')
        .replace('í', 'I')
        .replace('ó', 'O')
        .replace('ú', 'U')
        .replace('ñ', 'NY')
        .replace('gü', 'W')
        .replace('ü', 'U')
        .replace('b', 'V')
        .replace('ll', 'Y')
    : ''
}

export function spanishMetaphone(inputString: string): string {
  let metaphoneKey = ''
  const keyLength = 6
  let currentPos = 0
  let processedString = replaceSpanishCharacters((inputString + '    ').toLowerCase()).toUpperCase()

  while (metaphoneKey.length < keyLength && currentPos < processedString.length) {
    const currentChar = processedString.charAt(currentPos)

    if (isVowelInPosition(processedString, currentPos) && currentPos === 0) {
      metaphoneKey += currentChar
      currentPos++
    } else if (
      isStartOfAnyGivenSubstring(processedString, currentPos, 1, [
        'D',
        'F',
        'J',
        'K',
        'M',
        'N',
        'P',
        'T',
        'V',
        'L',
        'Y',
      ])
    ) {
      metaphoneKey += currentChar
      currentPos += processedString.charAt(currentPos + 1) === currentChar ? 2 : 1
    } else {
      switch (currentChar) {
        case 'C':
          if (processedString.charAt(currentPos + 1) === 'C') {
            metaphoneKey += 'X'
            currentPos += 2
          } else if (isStartOfAnyGivenSubstring(processedString, currentPos, 2, ['CE', 'CI'])) {
            metaphoneKey += 'Z'
            currentPos += 2
          } else {
            metaphoneKey += 'K'
            currentPos++
          }
          break
        case 'G':
          if (isStartOfAnyGivenSubstring(processedString, currentPos, 2, ['GE', 'GI'])) {
            metaphoneKey += 'J'
            currentPos += 2
          } else {
            metaphoneKey += 'G'
            currentPos++
          }
          break
        case 'H':
          if (isVowelInPosition(processedString, currentPos + 1)) {
            metaphoneKey += processedString.charAt(currentPos + 1)
            currentPos += 2
          } else {
            metaphoneKey += 'H'
            currentPos++
          }
          break
        case 'Q':
          currentPos += processedString.charAt(currentPos + 1) === 'U' ? 2 : 1
          metaphoneKey += 'K'
          break
        case 'W':
          metaphoneKey += 'U'
          currentPos++
          break
        case 'R':
        case 'Z':
          metaphoneKey += currentChar
          currentPos++
          break
        case 'S':
          if (currentPos === 0 && !isVowelInPosition(processedString, currentPos + 1)) {
            metaphoneKey += 'ES'
          } else {
            metaphoneKey += 'S'
          }
          currentPos++
          break
        case 'X':
          if (inputString.length > 1 && currentPos === 0 && !isVowelInPosition(processedString, currentPos + 1)) {
            metaphoneKey += 'EX'
          } else {
            metaphoneKey += 'X'
          }
          currentPos++
          break
        default:
          currentPos++
          break
      }
    }
  }
  return metaphoneKey.trim()
}
