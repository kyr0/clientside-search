import { Rule, Stemmer } from './stemmer'

const a_0: Rule[] = [
  ['arsen', -1, -1],
  ['commun', -1, -1],
  ['gener', -1, -1],
]

const a_1: Rule[] = [
  ["'", -1, 1],
  ["'s'", 0, 1],
  ["'s", -1, 1],
]

const a_2: Rule[] = [
  ['ied', -1, 2],
  ['s', -1, 3],
  ['ies', 1, 2],
  ['sses', 1, 1],
  ['ss', 1, -1],
  ['us', 1, -1],
]

const a_3: Rule[] = [
  ['', -1, 3],
  ['bb', 0, 2],
  ['dd', 0, 2],
  ['ff', 0, 2],
  ['gg', 0, 2],
  ['bl', 0, 1],
  ['mm', 0, 2],
  ['nn', 0, 2],
  ['pp', 0, 2],
  ['rr', 0, 2],
  ['at', 0, 1],
  ['tt', 0, 2],
  ['iz', 0, 1],
]

const a_4: Rule[] = [
  ['ed', -1, 2],
  ['eed', 0, 1],
  ['ing', -1, 2],
  ['edly', -1, 2],
  ['eedly', 3, 1],
  ['ingly', -1, 2],
]

const a_5: Rule[] = [
  ['anci', -1, 3],
  ['enci', -1, 2],
  ['ogi', -1, 13],
  ['li', -1, 15],
  ['bli', 3, 12],
  ['abli', 4, 4],
  ['alli', 3, 8],
  ['fulli', 3, 9],
  ['lessli', 3, 14],
  ['ousli', 3, 10],
  ['entli', 3, 5],
  ['aliti', -1, 8],
  ['biliti', -1, 12],
  ['iviti', -1, 11],
  ['tional', -1, 1],
  ['ational', 14, 7],
  ['alism', -1, 8],
  ['ation', -1, 7],
  ['ization', 17, 6],
  ['izer', -1, 6],
  ['ator', -1, 7],
  ['iveness', -1, 11],
  ['fulness', -1, 9],
  ['ousness', -1, 10],
]

const a_6: Rule[] = [
  ['icate', -1, 4],
  ['ative', -1, 6],
  ['alize', -1, 3],
  ['iciti', -1, 4],
  ['ical', -1, 4],
  ['tional', -1, 1],
  ['ational', 5, 2],
  ['ful', -1, 5],
  ['ness', -1, 5],
]

const a_7: Rule[] = [
  ['ic', -1, 1],
  ['ance', -1, 1],
  ['ence', -1, 1],
  ['able', -1, 1],
  ['ible', -1, 1],
  ['ate', -1, 1],
  ['ive', -1, 1],
  ['ize', -1, 1],
  ['iti', -1, 1],
  ['al', -1, 1],
  ['ism', -1, 1],
  ['ion', -1, 2],
  ['er', -1, 1],
  ['ous', -1, 1],
  ['ant', -1, 1],
  ['ent', -1, 1],
  ['ment', 15, 1],
  ['ement', 16, 1],
]

const a_8: Rule[] = [
  ['e', -1, 1],
  ['l', -1, 2],
]

const a_9: Rule[] = [
  ['succeed', -1, -1],
  ['proceed', -1, -1],
  ['exceed', -1, -1],
  ['canning', -1, -1],
  ['inning', -1, -1],
  ['earring', -1, -1],
  ['herring', -1, -1],
  ['outing', -1, -1],
]

const a_10: Rule[] = [
  ['andes', -1, -1],
  ['atlas', -1, -1],
  ['bias', -1, -1],
  ['cosmos', -1, -1],
  ['dying', -1, 3],
  ['early', -1, 9],
  ['gently', -1, 7],
  ['howe', -1, -1],
  ['idly', -1, 6],
  ['lying', -1, 4],
  ['news', -1, -1],
  ['only', -1, 10],
  ['singly', -1, 11],
  ['skies', -1, 2],
  ['skis', -1, 1],
  ['sky', -1, -1],
  ['tying', -1, 5],
  ['ugly', -1, 8],
]

const g_v = [17, 65, 16, 1]

const g_v_WXY = [1, 17, 65, 208, 1]

const g_valid_LI = [55, 141, 2]

/** Stemmer for the English language */
export class EnglishStemmer extends Stemmer {
  private B_Y_found = false
  private I_p2 = 0
  private I_p1 = 0

  private r_prelude() {
    this.B_Y_found = false
    const v_1 = this.cursor
    lab0: {
      this.bra = this.cursor
      if (!this.eq_s("'")) {
        break lab0
      }
      this.ket = this.cursor
      if (!this.slice_del()) {
        return false
      }
    }
    this.cursor = v_1
    const v_2 = this.cursor
    lab1: {
      this.bra = this.cursor
      if (!this.eq_s('y')) {
        break lab1
      }
      this.ket = this.cursor
      if (!this.slice_from('Y')) {
        return false
      }
      this.B_Y_found = true
    }
    this.cursor = v_2
    const v_3 = this.cursor
    while (true) {
      const v_4 = this.cursor
      lab3: {
        golab4: while (true) {
          const v_5 = this.cursor
          lab5: {
            if (!this.in_grouping(g_v, 97, 121)) {
              break lab5
            }
            this.bra = this.cursor
            if (!this.eq_s('y')) {
              break lab5
            }
            this.ket = this.cursor
            this.cursor = v_5
            break golab4
          }
          this.cursor = v_5
          if (this.cursor >= this.limit) {
            break lab3
          }
          this.cursor++
        }
        if (!this.slice_from('Y')) {
          return false
        }
        this.B_Y_found = true
        continue
      }
      this.cursor = v_4
      break
    }
    this.cursor = v_3
    return true
  }

  private r_mark_regions() {
    this.I_p1 = this.limit
    this.I_p2 = this.limit
    const v_1 = this.cursor
    lab0: {
      lab1: {
        const v_2 = this.cursor
        lab2: {
          if (this.find_among(a_0) == 0) {
            break lab2
          }
          break lab1
        }
        this.cursor = v_2
        golab3: while (true) {
          lab4: {
            if (!this.in_grouping(g_v, 97, 121)) {
              break lab4
            }
            break golab3
          }
          if (this.cursor >= this.limit) {
            break lab0
          }
          this.cursor++
        }
        golab5: while (true) {
          lab6: {
            if (!this.out_grouping(g_v, 97, 121)) {
              break lab6
            }
            break golab5
          }
          if (this.cursor >= this.limit) {
            break lab0
          }
          this.cursor++
        }
      }
      this.I_p1 = this.cursor
      golab7: while (true) {
        lab8: {
          if (!this.in_grouping(g_v, 97, 121)) {
            break lab8
          }
          break golab7
        }
        if (this.cursor >= this.limit) {
          break lab0
        }
        this.cursor++
      }
      golab9: while (true) {
        lab10: {
          if (!this.out_grouping(g_v, 97, 121)) {
            break lab10
          }
          break golab9
        }
        if (this.cursor >= this.limit) {
          break lab0
        }
        this.cursor++
      }
      this.I_p2 = this.cursor
    }
    this.cursor = v_1
    return true
  }

  private r_shortv() {
    lab0: {
      const v_1 = this.limit - this.cursor
      lab1: {
        if (!this.out_grouping_b(g_v_WXY, 89, 121)) {
          break lab1
        }
        if (!this.in_grouping_b(g_v, 97, 121)) {
          break lab1
        }
        if (!this.out_grouping_b(g_v, 97, 121)) {
          break lab1
        }
        break lab0
      }
      this.cursor = this.limit - v_1
      if (!this.out_grouping_b(g_v, 97, 121)) {
        return false
      }
      if (!this.in_grouping_b(g_v, 97, 121)) {
        return false
      }
      if (this.cursor > this.limit_backward) {
        return false
      }
    }
    return true
  }

  private r_R1() {
    if (!(this.I_p1 <= this.cursor)) {
      return false
    }
    return true
  }

  private r_R2() {
    if (!(this.I_p2 <= this.cursor)) {
      return false
    }
    return true
  }

  private r_Step_1a() {
    const v_1 = this.limit - this.cursor
    lab0: {
      this.ket = this.cursor
      if (this.find_among_b(a_1) == 0) {
        this.cursor = this.limit - v_1
        break lab0
      }
      this.bra = this.cursor
      if (!this.slice_del()) {
        return false
      }
    }
    this.ket = this.cursor
    const among_var = this.find_among_b(a_2)
    if (among_var == 0) {
      return false
    }
    this.bra = this.cursor
    switch (among_var) {
      case 1:
        if (!this.slice_from('ss')) {
          return false
        }
        break
      case 2:
        lab1: {
          const v_2 = this.limit - this.cursor
          lab2: {
            {
              const c1 = this.cursor - 2
              if (c1 < this.limit_backward) {
                break lab2
              }
              this.cursor = c1
            }
            if (!this.slice_from('i')) {
              return false
            }
            break lab1
          }
          this.cursor = this.limit - v_2
          if (!this.slice_from('ie')) {
            return false
          }
        }
        break
      case 3:
        if (this.cursor <= this.limit_backward) {
          return false
        }
        this.cursor--
        golab3: while (true) {
          lab4: {
            if (!this.in_grouping_b(g_v, 97, 121)) {
              break lab4
            }
            break golab3
          }
          if (this.cursor <= this.limit_backward) {
            return false
          }
          this.cursor--
        }
        if (!this.slice_del()) {
          return false
        }
        break
    }
    return true
  }

  private r_Step_1b() {
    this.ket = this.cursor
    const among_var = this.find_among_b(a_4)
    if (among_var == 0) {
      return false
    }
    this.bra = this.cursor
    switch (among_var) {
      case 1:
        if (!this.r_R1()) {
          return false
        }
        if (!this.slice_from('ee')) {
          return false
        }
        break
      case 2: {
        const v_1 = this.limit - this.cursor
        golab0: while (true) {
          lab1: {
            if (!this.in_grouping_b(g_v, 97, 121)) {
              break lab1
            }
            break golab0
          }
          if (this.cursor <= this.limit_backward) {
            return false
          }
          this.cursor--
        }
        this.cursor = this.limit - v_1
        if (!this.slice_del()) {
          return false
        }
        const v_3 = this.limit - this.cursor
        const among_var = this.find_among_b(a_3)
        if (among_var == 0) {
          return false
        }
        this.cursor = this.limit - v_3
        switch (among_var) {
          case 1:
            {
              const c1 = this.cursor
              this.insert(this.cursor, this.cursor, 'e')
              this.cursor = c1
            }
            break
          case 2:
            this.ket = this.cursor
            if (this.cursor <= this.limit_backward) {
              return false
            }
            this.cursor--
            this.bra = this.cursor
            if (!this.slice_del()) {
              return false
            }
            break
          case 3: {
            if (this.cursor != this.I_p1) {
              return false
            }
            const v_4 = this.limit - this.cursor
            if (!this.r_shortv()) {
              return false
            }
            this.cursor = this.limit - v_4
            {
              const c2 = this.cursor
              this.insert(this.cursor, this.cursor, 'e')
              this.cursor = c2
            }
            break
          }
        }
        break
      }
    }
    return true
  }

  private r_Step_1c() {
    this.ket = this.cursor
    lab0: {
      const v_1 = this.limit - this.cursor
      lab1: {
        if (!this.eq_s_b('y')) {
          break lab1
        }
        break lab0
      }
      this.cursor = this.limit - v_1
      if (!this.eq_s_b('Y')) {
        return false
      }
    }
    this.bra = this.cursor
    if (!this.out_grouping_b(g_v, 97, 121)) {
      return false
    }
    lab2: {
      if (this.cursor > this.limit_backward) {
        break lab2
      }
      return false
    }
    if (!this.slice_from('i')) {
      return false
    }
    return true
  }

  private r_Step_2() {
    this.ket = this.cursor
    const among_var = this.find_among_b(a_5)
    if (among_var == 0) {
      return false
    }
    this.bra = this.cursor
    if (!this.r_R1()) {
      return false
    }
    switch (among_var) {
      case 1:
        if (!this.slice_from('tion')) {
          return false
        }
        break
      case 2:
        if (!this.slice_from('ence')) {
          return false
        }
        break
      case 3:
        if (!this.slice_from('ance')) {
          return false
        }
        break
      case 4:
        if (!this.slice_from('able')) {
          return false
        }
        break
      case 5:
        if (!this.slice_from('ent')) {
          return false
        }
        break
      case 6:
        if (!this.slice_from('ize')) {
          return false
        }
        break
      case 7:
        if (!this.slice_from('ate')) {
          return false
        }
        break
      case 8:
        if (!this.slice_from('al')) {
          return false
        }
        break
      case 9:
        if (!this.slice_from('ful')) {
          return false
        }
        break
      case 10:
        if (!this.slice_from('ous')) {
          return false
        }
        break
      case 11:
        if (!this.slice_from('ive')) {
          return false
        }
        break
      case 12:
        if (!this.slice_from('ble')) {
          return false
        }
        break
      case 13:
        if (!this.eq_s_b('l')) {
          return false
        }
        if (!this.slice_from('og')) {
          return false
        }
        break
      case 14:
        if (!this.slice_from('less')) {
          return false
        }
        break
      case 15:
        if (!this.in_grouping_b(g_valid_LI, 99, 116)) {
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        break
    }
    return true
  }

  private r_Step_3() {
    this.ket = this.cursor
    const among_var = this.find_among_b(a_6)
    if (among_var == 0) {
      return false
    }
    this.bra = this.cursor
    if (!this.r_R1()) {
      return false
    }
    switch (among_var) {
      case 1:
        if (!this.slice_from('tion')) {
          return false
        }
        break
      case 2:
        if (!this.slice_from('ate')) {
          return false
        }
        break
      case 3:
        if (!this.slice_from('al')) {
          return false
        }
        break
      case 4:
        if (!this.slice_from('ic')) {
          return false
        }
        break
      case 5:
        if (!this.slice_del()) {
          return false
        }
        break
      case 6:
        if (!this.r_R2()) {
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        break
    }
    return true
  }

  private r_Step_4() {
    this.ket = this.cursor
    const among_var = this.find_among_b(a_7)
    if (among_var == 0) {
      return false
    }
    this.bra = this.cursor
    if (!this.r_R2()) {
      return false
    }
    switch (among_var) {
      case 1:
        if (!this.slice_del()) {
          return false
        }
        break
      case 2:
        lab0: {
          const v_1 = this.limit - this.cursor
          lab1: {
            if (!this.eq_s_b('s')) {
              break lab1
            }
            break lab0
          }
          this.cursor = this.limit - v_1
          if (!this.eq_s_b('t')) {
            return false
          }
        }
        if (!this.slice_del()) {
          return false
        }
        break
    }
    return true
  }

  private r_Step_5() {
    this.ket = this.cursor
    const among_var = this.find_among_b(a_8)
    if (among_var == 0) {
      return false
    }
    this.bra = this.cursor
    switch (among_var) {
      case 1:
        lab0: {
          const v_1 = this.limit - this.cursor
          lab1: {
            if (!this.r_R2()) {
              break lab1
            }
            break lab0
          }
          this.cursor = this.limit - v_1
          if (!this.r_R1()) {
            return false
          }
          {
            const v_2 = this.limit - this.cursor
            lab2: {
              if (!this.r_shortv()) {
                break lab2
              }
              return false
            }
            this.cursor = this.limit - v_2
          }
        }
        if (!this.slice_del()) {
          return false
        }
        break
      case 2:
        if (!this.r_R2()) {
          return false
        }
        if (!this.eq_s_b('l')) {
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        break
    }
    return true
  }

  private r_exception2() {
    this.ket = this.cursor
    if (this.find_among_b(a_9) == 0) {
      return false
    }
    this.bra = this.cursor
    if (this.cursor > this.limit_backward) {
      return false
    }
    return true
  }

  private r_exception1() {
    this.bra = this.cursor
    const among_var = this.find_among(a_10)
    if (among_var == 0) {
      return false
    }
    this.ket = this.cursor
    if (this.cursor < this.limit) {
      return false
    }
    switch (among_var) {
      case 1:
        if (!this.slice_from('ski')) {
          return false
        }
        break
      case 2:
        if (!this.slice_from('sky')) {
          return false
        }
        break
      case 3:
        if (!this.slice_from('die')) {
          return false
        }
        break
      case 4:
        if (!this.slice_from('lie')) {
          return false
        }
        break
      case 5:
        if (!this.slice_from('tie')) {
          return false
        }
        break
      case 6:
        if (!this.slice_from('idl')) {
          return false
        }
        break
      case 7:
        if (!this.slice_from('gentl')) {
          return false
        }
        break
      case 8:
        if (!this.slice_from('ugli')) {
          return false
        }
        break
      case 9:
        if (!this.slice_from('earli')) {
          return false
        }
        break
      case 10:
        if (!this.slice_from('onli')) {
          return false
        }
        break
      case 11:
        if (!this.slice_from('singl')) {
          return false
        }
        break
    }
    return true
  }

  private r_postlude() {
    if (!this.B_Y_found) {
      return false
    }
    while (true) {
      const v_1 = this.cursor
      lab0: {
        golab1: while (true) {
          const v_2 = this.cursor
          lab2: {
            this.bra = this.cursor
            if (!this.eq_s('Y')) {
              break lab2
            }
            this.ket = this.cursor
            this.cursor = v_2
            break golab1
          }
          this.cursor = v_2
          if (this.cursor >= this.limit) {
            break lab0
          }
          this.cursor++
        }
        if (!this.slice_from('y')) {
          return false
        }
        continue
      }
      this.cursor = v_1
      break
    }
    return true
  }

  _stemHelper() {
    lab0: {
      const v_1 = this.cursor
      lab1: {
        if (!this.r_exception1()) {
          break lab1
        }
        break lab0
      }
      this.cursor = v_1
      lab2: {
        {
          const v_2 = this.cursor
          lab3: {
            {
              const c1 = this.cursor + 3
              if (c1 > this.limit) {
                break lab3
              }
              this.cursor = c1
            }
            break lab2
          }
          this.cursor = v_2
        }
        break lab0
      }
      this.cursor = v_1
      this.r_prelude()
      this.r_mark_regions()
      this.limit_backward = this.cursor
      this.cursor = this.limit
      const v_5 = this.limit - this.cursor
      this.r_Step_1a()
      this.cursor = this.limit - v_5
      lab4: {
        const v_6 = this.limit - this.cursor
        lab5: {
          if (!this.r_exception2()) {
            break lab5
          }
          break lab4
        }
        this.cursor = this.limit - v_6
        const v_7 = this.limit - this.cursor
        this.r_Step_1b()
        this.cursor = this.limit - v_7
        const v_8 = this.limit - this.cursor
        this.r_Step_1c()
        this.cursor = this.limit - v_8
        const v_9 = this.limit - this.cursor
        this.r_Step_2()
        this.cursor = this.limit - v_9
        const v_10 = this.limit - this.cursor
        this.r_Step_3()
        this.cursor = this.limit - v_10
        const v_11 = this.limit - this.cursor
        this.r_Step_4()
        this.cursor = this.limit - v_11
        const v_12 = this.limit - this.cursor
        this.r_Step_5()
        this.cursor = this.limit - v_12
      }
      this.cursor = this.limit_backward
      const v_13 = this.cursor
      this.r_postlude()
      this.cursor = v_13
    }
    return true
  }
}

const englishStemmer = new EnglishStemmer()

export const stem_en = (word: string): string => englishStemmer.stem(word)
