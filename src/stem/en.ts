const categorizeGroups = (token: string): string =>
  token
    .replace(/[^aeiouy]+y/g, 'CV')
    .replace(/[aeiou]+/g, 'V')
    .replace(/[^V]+/g, 'C')

const categorizeChars = (token: string): string =>
  token
    .replace(/[^aeiouy]y/g, 'CV')
    .replace(/[aeiou]/g, 'V')
    .replace(/[^V]/g, 'C')

const measure = (token: string): number =>
  !token ? -1 : categorizeGroups(token).replace(/^C/, '').replace(/V$/, '').length / 2

const endsWithDoublCons = (token: string): boolean => !!token.match(/([^aeiou])\1$/)

const attemptReplace = (
  token: string,
  pattern: string | RegExp,
  replacement: string,
  callback?: (result: string) => string,
): string | null => {
  let result: string | null = null
  if (
    (typeof pattern === 'string' && token.substr(0 - pattern.length) === pattern) ||
    (pattern instanceof RegExp && token.match(pattern))
  ) {
    result = token.replace(typeof pattern === 'string' ? new RegExp(`${pattern}$`) : pattern, replacement)
  }

  return result && callback ? callback(result) : result
}

const attemptReplacePatterns = (
  token: string,
  replacements: Array<[string | RegExp, string, string]>,
  measureThreshold: number | null = null,
): string => {
  let replacement = token
  replacements.forEach(([r1, r2, r3]) => {
    if (measureThreshold == null || measure(attemptReplace(token, r1, r2) || '') > measureThreshold) {
      replacement = attemptReplace(replacement, r1, r3) || replacement
    }
  })

  return replacement
}

const replacePatterns = (
  token: string,
  replacements: Array<[string | RegExp, string, string]>,
  measureThreshold: number | null,
): string => attemptReplacePatterns(token, replacements, measureThreshold) || token

const replaceRegex = (token: string, regex: RegExp, includeParts: number[], minimumMeasure: number): string | null => {
  let result = ''

  if (regex.test(token)) {
    const parts = regex.exec(token)
    includeParts.forEach((i) => {
      result += parts ? parts[i] : ''
    })
  }

  return measure(result) > minimumMeasure ? result : null
}

const step1a = (token: string): string =>
  token.match(/(ss|i)es$/)
    ? token.replace(/(ss|i)es$/, '$1')
    : token.substr(-1) === 's' && token.substr(-2, 1) !== 's' && token.length > 2
    ? token.replace(/s?$/, '')
    : token

const step1b = (token: string): string => {
  let result: string | null

  if (token.substr(-3) === 'eed') {
    return measure(token.substr(0, token.length - 3)) > 0 ? token.replace(/eed$/, 'ee') : token
  }

  result = attemptReplace(token, /(ed|ing)$/, '', (token) => {
    if (categorizeGroups(token).indexOf('V') >= 0) {
      result = attemptReplacePatterns(token, [
        ['at', '', 'ate'],
        ['bl', '', 'ble'],
        ['iz', '', 'ize'],
      ])
      if (result !== token) {
        return result
      } else {
        if (endsWithDoublCons(token) && token.match(/[^lsz]$/)) {
          return token.replace(/([^aeiou])\1$/, '$1')
        }
        if (measure(token) === 1 && categorizeChars(token).substr(-3) === 'CVC' && token.match(/[^wxy]$/)) {
          return token + 'e'
        }
      }
      return token
    }
    return null
  })

  return result ? result : token
}

const step1c = (token: string): string =>
  token.substr(-1) === 'y' &&
  categorizeGroups(token)
    .substr(0, categorizeGroups(token).length - 1)
    .indexOf('V') > -1
    ? token.replace(/y$/, 'i')
    : token

const step2 = (token: string): string =>
  replacePatterns(
    token,
    [
      ['ational', '', 'ate'],
      ['tional', '', 'tion'],
      ['enci', '', 'ence'],
      ['anci', '', 'ance'],
      ['izer', '', 'ize'],
      ['abli', '', 'able'],
      ['bli', '', 'ble'],
      ['alli', '', 'al'],
      ['entli', '', 'ent'],
      ['eli', '', 'e'],
      ['ousli', '', 'ous'],
      ['ization', '', 'ize'],
      ['ation', '', 'ate'],
      ['ator', '', 'ate'],
      ['alism', '', 'al'],
      ['iveness', '', 'ive'],
      ['fulness', '', 'ful'],
      ['ousness', '', 'ous'],
      ['aliti', '', 'al'],
      ['iviti', '', 'ive'],
      ['biliti', '', 'ble'],
      ['logi', '', 'log'],
    ],
    0,
  )

const step3 = (token: string): string =>
  replacePatterns(
    token,
    [
      ['icate', '', 'ic'],
      ['ative', '', ''],
      ['alize', '', 'al'],
      ['iciti', '', 'ic'],
      ['ical', '', 'ic'],
      ['ful', '', ''],
      ['ness', '', ''],
    ],
    0,
  )

const step4 = (token: string): string =>
  replaceRegex(token, /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/, [1], 1) ||
  replaceRegex(token, /^(.+?)(s|t)(ion)$/, [1, 2], 1) ||
  token

const step5a = (token: string): string => {
  const m = measure(token.replace(/e$/, ''))
  return m > 1 || (m === 1 && !(categorizeChars(token).substr(-4, 3) === 'CVC' && token.match(/[^wxy].$/)))
    ? token.replace(/e$/, '')
    : token
}

const step5b = (token: string): string => (measure(token) > 1 ? token.replace(/ll$/, 'l') : token)

export const stem_en = (token: string): string =>
  token.length < 3 ? token : step5b(step5a(step4(step3(step2(step1c(step1b(step1a(token.toLowerCase())))))))).toString()
