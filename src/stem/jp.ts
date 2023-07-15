// experimental
// TODO:
export class JapaneseStemmer {
  verbEndings = ['ませんでした', 'ました', 'ません', 'ます', 'ない', 'なかった']
  // list of endings used in na-adjectives
  naAdjectiveEndings = [
    'です',
    'だ',
    'でした',
    'だった',
    'ではありません',
    'ではない',
    'ではありませんでした',
    'ではなかった',
    'じゃない',
  ]

  // list of endings used in i-adjectives
  iAdjectiveEndings = ['くなかった', 'かった', 'くない']

  // lists representing different categories of Japanese hiragana
  hiraganaWords = ['わ', 'か', 'が', 'さ', 'ざ', 'た', 'だ', 'な', 'ま', 'は', 'ば', 'ぱ', 'ら', 'や']
  hiraganaI = ['い', 'き', 'ぎ', 'し', 'じ', 'ち', 'ぢ', 'に', 'み', 'ひ', 'び', 'ぴ', 'り']
  hiraganaU = ['う', 'く', 'ぐ', 'す', 'ず', 'つ', 'づ', 'ぬ', 'む', 'ふ', 'ぶ', 'ぷ', 'る', 'ゆ']
  hiraganaE = ['え', 'け', 'げ', 'せ', 'ぜ', 'て', 'で', 'ね', 'め', 'へ', 'べ', 'ぺ', 'れ']
  hiraganaO = ['お', 'こ', 'ご', 'そ', 'ぞ', 'と', 'ど', 'の', 'も', 'ほ', 'ぼ', 'ぽ', 'ろ', 'よ']
  informalE = ['って', 'った', 'んで', 'んだ', 'いて', 'いた', 'きて', 'いで', 'いだ', 'ぎで']
  word = ''
  wordGroup = ['']
  wordEnding = ''
  wordType = ''
  originalWord = ''
  continueProcessing = true

  stem(word: string) {
    this.word = word
    this.originalWord = this.word
    this.word = this.word.trim().replace('.', '')
    this.continueProcessing = true
    this.step1()

    if (this.wordGroup[0] !== '') {
      this.word = this.word.slice(0, this.word.length - this.wordEnding.length)

      if (this.wordType === 'vb') {
        this.step2()
        this.step3()
        this.step4()
        this.step5()
        this.step6()
        this.step7()
        this.step8()
      } else {
        this.step2a()
      }
    }
    return this.word
  }

  step1() {
    if (/[\u3040-\u309F]/.test(this.word)) {
      if (this.checkadj() === true) {
        this.wordType = 'adj'
      } else {
        this.wordType = 'vb'
        this.checkvb()
      }
    } else {
      this.wordGroup = ['']
    }
  }

  step2() {
    if (this.wordGroup[1] === 'G') {
      if (
        this.wordGroup[0] === 'C' &&
        !this.hiraganaU.includes(this.word[this.word.length - 1]) &&
        this.word[this.word.length - 1] !== 'る'
      ) {
        if (this.hiraganaWords.includes(this.word[this.originalWord.length - (this.wordEnding.length + 1)])) {
          this.word =
            this.word.slice(0, this.word.length - 1) +
            this.hiraganaU[this.hiraganaWords.indexOf(this.word[this.word.length - 1])]
        } else if (this.hiraganaI.includes(this.word[this.originalWord.length - (this.wordEnding.length + 1)])) {
          this.word =
            this.word.slice(0, this.word.length - 1) +
            this.hiraganaU[this.hiraganaI.indexOf(this.word[this.word.length - 1])]
        }
      }

      if (this.wordGroup[0] === 'C') {
        this.word += 'る'
      }
    }

    if (this.wordGroup[0] === 'shimasu') {
      this.word += 'る'
    }
  }

  step3() {
    if (this.wordGroup[1] === 'tte') {
      if (this.wordGroup[0] === 'one') {
        this.word = this.originalWord
      } else if (this.wordGroup[0] === 'two') {
        this.word += 'る'
      }
    }
  }

  step4() {
    if (this.wordGroup[1] === 'pot' && this.wordGroup[0] === 'one') {
      //this.word = this.word.slice(0, this.word.length - 1) + this.ulist[this.wordlist.indexOf(this.word[this.word.length - 1])] + 'る';
    }
  }

  step5() {
    if (this.wordGroup[1] === 'imp' && this.wordGroup[0] === 'two') {
      this.word += 'る'
    }
  }

  step6() {
    if (this.wordGroup[1] === 'vol') {
      if (this.wordGroup[0] === 'one') {
        this.word += this.hiraganaU[this.hiraganaO.indexOf(this.wordEnding[0])]
      } else if (this.wordGroup[0] === 'two') {
        this.word += 'る'
      }
    }
  }

  step7() {
    if (this.wordGroup[1] === 'pass' && this.wordGroup[0] === 'one') {
      this.word =
        this.word.slice(0, this.word.length - 1) +
        this.hiraganaU[this.hiraganaWords.indexOf(this.word[this.word.length - 1])]
    }
  }

  step8() {
    if (this.wordGroup[1] === 'cause') {
      if (this.wordGroup[0] === 'one') {
        this.word =
          this.word.slice(0, this.word.length - 1) +
          this.hiraganaU[this.hiraganaWords.indexOf(this.word[this.word.length - 1])]
      } else if (this.wordGroup[0] === 'two') {
        this.word += 'る'
      }
    }
  }

  step2a() {
    if (this.wordGroup[1] === 'H') {
      if (this.wordGroup[0] === 'J') {
        this.word += 'い'
      }

      if (this.wordGroup[0] === 'na') {
        this.word = this.word.slice(0, this.word.length - this.wordEnding.length)
      }
    }
  }

  checkvb() {
    this.checkEnd()
    this.checkPlain2()
    this.checkPlain1()
    this.checkCond()
    this.checkPot()
    this.checkCause()
    this.checkImp()
    this.checkVol()
    this.checkPass()
    this.checkTe()
  }

  checkadj() {
    for (let i of this.iAdjectiveEndings) {
      if (this.word[this.word.length - 1] === 'い' && !this.word.endsWith('じゃない')) {
        if (this.word[this.word.length - 2] !== 'な') {
          this.wordGroup = ['i', 'adjective']
          this.wordEnding = 'い'
          return true
        } else if (this.word.slice(-3) === 'くない') {
          this.wordGroup = ['i', 'adjective']
          this.wordEnding = 'くない'
          return true
        } else {
          return false
        }
      }

      if (this.word.endsWith(i)) {
        if (this.word.endsWith('かった') && !this.word.endsWith('くなかった')) {
          if (this.hiraganaWords.includes(this.word[this.word.length - 4])) {
            return false
          }
        }
        this.wordGroup = ['i', 'adjective']
        this.wordEnding = i
        return true
      } else if (this.word.endsWith('じゃな' + i)) {
        this.wordGroup = ['i', 'adjective']
        this.wordEnding = 'じゃな' + i
        return true
      }
    }

    for (let i of this.naAdjectiveEndings) {
      if (this.word.endsWith(i)) {
        this.wordGroup = ['na', 'adjective']
        this.wordEnding = i
      }
    }
  }

  checkEnd() {
    for (let i of this.verbEndings) {
      if (this.word.endsWith(i)) {
        let preEndIndex = this.originalWord.length - i.length - 1
        if (this.hiraganaI.includes(this.word[preEndIndex])) {
          if (this.word.endsWith('します')) {
            this.wordGroup = ['shimasu', 'normal']
            this.wordEnding = 'ます'
          } else {
            this.wordGroup = ['one', 'normal']
            this.wordEnding = i
          }
        } else if (i === 'ませんでした') {
          this.wordEnding = i
          if (this.hiraganaI.includes(this.word[this.word.length - i.length - 1])) {
            this.wordGroup = ['one', 'normal']
            this.wordEnding = i
          } else {
            this.wordGroup = ['two', 'normal']
            this.wordEnding = i
          }
        } else if (this.hiraganaWords.includes(this.word[preEndIndex])) {
          this.wordGroup = ['one', 'normal']
          this.wordEnding = i
        } else if (this.hiraganaE.includes(this.word[preEndIndex])) {
          this.wordGroup = ['two', 'normal']
          this.wordEnding = i
        }
      }
    }
  }

  checkCond() {
    for (let i of this.hiraganaE) {
      if (this.word.endsWith(i + 'ば')) {
        this.wordGroup = ['two', 'cond']
        this.wordEnding = 'ば'
      } else if (this.word[this.word.length - 1] === 'ば') {
        this.wordGroup = ['one', 'cond']
      }
    }
  }

  checkPlain1() {
    if (!this.verbEndings.includes(this.wordEnding)) {
      if (this.hiraganaU.includes(this.word[this.originalWord.length - 1])) {
        for (let i of this.hiraganaWords) {
          if (this.word.endsWith(i + 'れる')) {
            this.wordGroup = ['one', 'pot']
            this.wordEnding = 'れる'
          }
        }
      }

      if (this.word.endsWith('られる')) {
        this.wordGroup = ['two', 'pot']
        this.wordEnding = 'られる'
      } else {
        if (this.wordGroup.length === 0) {
          this.wordGroup = ['one', 'normal']
          this.wordEnding = ''
        }
      }
    }
  }

  checkPlain2() {
    if (this.originalWord.length === 2 && this.word[1] === 'る') {
      this.wordGroup = ['two', 'normal']
      this.wordEnding = 'る'
    } else if (
      this.word[this.originalWord.length - 1] === 'る' &&
      this.hiraganaE.includes(this.word[this.originalWord.length - 2]) &&
      !this.hiraganaWords.includes(this.word[this.originalWord.length - 3])
    ) {
      this.wordGroup = ['two', 'normal']
      this.wordEnding = 'る'
      this.wordEnding = this.word[this.originalWord.length - 1]
    }
  }

  checkCause() {
    if (this.word.endsWith('せる')) {
      if (this.hiraganaE.includes(this.word[this.word.length - 4])) {
        this.wordGroup = ['two', 'cause']
        this.wordEnding = this.word[this.word.length - 4] + 'せる'
      } else if (this.hiraganaWords.includes(this.word[this.word.length - 3])) {
        this.wordGroup = ['one', 'cause']
        this.wordEnding = 'せる'
      }
    }
  }

  checkPot() {
    if (this.word.endsWith('られる')) {
      this.wordGroup = ['two', 'pot']
      this.wordEnding = 'られる'
    }
  }

  checkImp() {
    if (this.hiraganaE.includes(this.word[this.word.length - 1])) {
      this.wordGroup = ['one', 'imp']
      this.wordEnding = ''
    } else if (this.word[this.word.length - 1] === 'ろ') {
      this.wordGroup = ['two', 'imp']
      this.wordEnding = 'ろ'
    }
  }

  checkVol() {
    if (this.hiraganaO.includes(this.word[this.word.length - 2])) {
      for (let i of this.hiraganaO) {
        if (this.word.endsWith('よう')) {
          this.wordGroup = ['two', 'vol']
          this.wordEnding = 'よう'
        } else if (this.word.endsWith(i + 'う') && this.wordGroup[0] !== 'two') {
          this.wordGroup = ['one', 'vol']
          this.wordEnding = i + 'う'
        }
      }
    }
  }

  checkPass() {
    for (let i of this.hiraganaWords) {
      if (this.word.endsWith(i + 'れる')) {
        this.wordGroup = ['one', 'pass']
        this.wordEnding = 'れる'
      }
    }
  }

  checkTe() {
    if (this.wordGroup[0] === '') {
      for (let i of this.informalE) {
        if (this.word.endsWith(i)) {
          this.wordGroup = ['one', 'tte']
          this.wordEnding = i
        } else {
          if (this.word.endsWith('て')) {
            this.wordEnding = 'て'
          } else if (this.word.endsWith('た')) {
            this.wordEnding = 'た'
          }
        }
      }
    }
  }
}

const japaneseStemmer = new JapaneseStemmer()

export function stem_jp(w: string) {
  return japaneseStemmer.stem(w)
}
