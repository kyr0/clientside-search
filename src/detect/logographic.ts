import { Iso2LanguageKey } from '../engine'

const CHINESE_ISO_CODE = 'zh'
const JAPANESE_ISO_CODE = 'ja'

const COMMON_WORDS = {
  [CHINESE_ISO_CODE]: [
    '的',
    '一',
    '是',
    '在',
    '我',
    '有',
    '我们',
    '你',
    '他们',
    '这',
    '他',
    '不',
    '了',
    '人',
    '都',
    '个',
    '这个',
    '上',
    '为',
    '与',
    '们',
    '来',
    '到',
    '时',
    '大',
    '地',
    '为了',
    '出',
    '可',
    '就',
    '要',
    '下',
    '以',
    '生',
    '会',
    '家',
    '可是',
    '去',
    '说',
    '里',
    '后',
    '子',
    '得',
    '于',
    '年',
    '着',
    '知',
    '国',
    '看',
    '能',
  ],
  [JAPANESE_ISO_CODE]: [
    'の',
    '私',
    'あなた',
    'それら',
    'ため',
    'から',
    'によって',
    '彼女',
    '彼',
    'こと',
    'これ',
    'です',
    'それ',
    'と',
    'する',
    'が',
    'た',
    'も',
    'に',
    'で',
    'ない',
    'を',
    'へ',
    'だ',
    'ある',
    'な',
    '私たち',
    'より',
    'または',
    'その',
    'だけ',
    'これら',
    'か',
    'たり',
    'それぞれ',
    'その他',
    '彼ら',
    'として',
    '自分',
    'した',
    'ここ',
    'みたい',
    'だから',
    'よう',
    'どう',
    'もの',
    'それで',
    'また',
    'かも',
    'れ',
  ],
}
const COMMON_BIGRAMS = {
  [CHINESE_ISO_CODE]: [
    '的人',
    '他们的',
    '自己的',
    '这是',
    '我们的',
    '你的',
    '一种',
    '可以',
    '如果',
    '所有',
    '这个',
    '如何',
    '因为',
    '那个',
    '更多',
    '什么',
    '没有',
    '只是',
    '人们',
    '最大',
    '你们',
    '每个',
    '这样',
    '这些',
    '其他',
  ],
  [JAPANESE_ISO_CODE]: [
    'それは',
    '私たち',
    '彼の',
    '彼女の',
    'あなたの',
    '私の',
    'ない',
    'すること',
    '彼らの',
    'それを',
    'これは',
    'どのように',
    'そのため',
    'これを',
    'その',
    'これらの',
    'あなたが',
    'より多くの',
    '何',
    'ではない',
    '彼女が',
    '私たちの',
    '各',
    'これに',
    '他の',
  ],
}

const COMMON_TRIGRAMS = {
  [CHINESE_ISO_CODE]: [
    '我们可以',
    '你可以',
    '如果你',
    '我希望',
    '我想',
    '我不',
    '我在',
    '他们在',
    '你在',
    '我们在',
    '这就是为什么',
    '你有没有',
    '他们没有',
    '一起工作',
    '不需要',
  ],
  [JAPANESE_ISO_CODE]: [
    '私たちは',
    'あなたは',
    '彼らは',
    '私は',
    'あなたが',
    '私が',
    '彼女が',
    '彼が',
    'それが',
    'これが',
    'それはない',
    'これはない',
    'あなたがない',
    '私たちはない',
    'あなたたちはない',
  ],
}

const CHARACTER_FREQUENCIES = {
  [CHINESE_ISO_CODE]: '的一是不我了有你在人这中大来上个国我会发学，'.split(''),
  [JAPANESE_ISO_CODE]: 'のとをはにもがでたすまそあんいかこやるしれ、'.split(''),
}
const UNIQUE_CHINESE_CHARACTERS = '囗卩爪爿丬'.split('')
const UNIQUE_JAPANESE_CHARACTERS = '々〆〒'.split('')

const GRAMMAR_PATTERNS = {
  [CHINESE_ISO_CODE]: /[\u4e00-\u9fa5]+/g,
  [JAPANESE_ISO_CODE]: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー々〆〤]+/gu,
}

const JAPANESE_PARTICLES = 'がのにをでと'.split('')
const CHINESE_PARTICLES = '的了和是就在都而已'.split('')

const calculateFrequency = (text: string, words: Array<string>) => {
  let frequency = 0
  for (const word of words) {
    const matches = text.match(new RegExp(word, 'g'))
    frequency += (matches || []).length
  }
  return frequency
}

const calculateCharacterFrequency = (text: string, characters: Array<string>) => {
  return characters.reduce((sum, char) => sum + (text.split(char).length - 1), 0)
}

const calculateParticleUsage = (text, particles) => {
  return particles.reduce((sum, particle) => sum + (text.split(particle).length - 1), 0)
}

const applyGrammarRules = (text: string, language: Iso2LanguageKey) => {
  const matches = text.match(GRAMMAR_PATTERNS[language])
  return (matches || []).length
}

const detectUniqueCharacters = (text: string, uniqueCharacters: Array<string>) => {
  return uniqueCharacters.some((char) => text.includes(char)) ? 5 : 0
}

export interface AsianLanguageScores {
  language: Iso2LanguageKey | 'latin'
  scores: { [key in Iso2LanguageKey]?: number }
}

export const detectLogographicLanguage = (input: string): AsianLanguageScores => {
  const asianRegex = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu
  const asianMatches = input.match(asianRegex)

  if (!asianMatches) {
    return { language: 'latin', scores: { zh: 0, ja: 0 } }
  }

  let languageScores = {
    zh: 0,
    ja: 0,
  }

  let maxScore = 0
  let detectedLanguage: Iso2LanguageKey | 'latin' = 'latin'

  for (const language in COMMON_WORDS) {
    const wordFrequency = calculateFrequency(input, COMMON_WORDS[language])
    const bigramFrequency = calculateFrequency(input, COMMON_BIGRAMS[language])
    const trigramFrequency = calculateFrequency(input, COMMON_TRIGRAMS[language])
    const charFrequency = calculateCharacterFrequency(input, CHARACTER_FREQUENCIES[language])
    const grammarScore = applyGrammarRules(input, language)

    let particleScore = 0
    let uniqueCharScore = 0
    if (language === JAPANESE_ISO_CODE) {
      particleScore = calculateParticleUsage(input, JAPANESE_PARTICLES)
      uniqueCharScore = detectUniqueCharacters(input, UNIQUE_JAPANESE_CHARACTERS)
    } else if (language === CHINESE_ISO_CODE) {
      particleScore = calculateParticleUsage(input, CHINESE_PARTICLES)
      uniqueCharScore = detectUniqueCharacters(input, UNIQUE_CHINESE_CHARACTERS)
    }

    const totalScore =
      wordFrequency * 0.15 +
      bigramFrequency * 0.25 +
      trigramFrequency * 0.25 +
      charFrequency * 0.1 +
      grammarScore * 0.1 +
      particleScore * 0.075 +
      uniqueCharScore * 0.05

    languageScores[language as Iso2LanguageKey] = totalScore

    if (totalScore > maxScore) {
      maxScore = totalScore
      detectedLanguage = language as Iso2LanguageKey
    }
  }

  return { language: detectedLanguage, scores: languageScores }
}
