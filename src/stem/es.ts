import { Rule, Stemmer } from './stemmer'

const a_0: Rule[] = [
  ['', -1, 6],
  ['\u00E1', 0, 1],
  ['\u00E9', 0, 2],
  ['\u00ED', 0, 3],
  ['\u00F3', 0, 4],
  ['\u00FA', 0, 5],
]

const a_1: Rule[] = [
  ['la', -1, -1],
  ['sela', 0, -1],
  ['le', -1, -1],
  ['me', -1, -1],
  ['se', -1, -1],
  ['lo', -1, -1],
  ['selo', 5, -1],
  ['las', -1, -1],
  ['selas', 7, -1],
  ['les', -1, -1],
  ['los', -1, -1],
  ['selos', 10, -1],
  ['nos', -1, -1],
]

const a_2: Rule[] = [
  ['ando', -1, 6],
  ['iendo', -1, 6],
  ['yendo', -1, 7],
  ['\u00E1ndo', -1, 2],
  ['i\u00E9ndo', -1, 1],
  ['ar', -1, 6],
  ['er', -1, 6],
  ['ir', -1, 6],
  ['\u00E1r', -1, 3],
  ['\u00E9r', -1, 4],
  ['\u00EDr', -1, 5],
]

const a_3: Rule[] = [
  ['ic', -1, -1],
  ['ad', -1, -1],
  ['os', -1, -1],
  ['iv', -1, 1],
]

const a_4: Rule[] = [
  ['able', -1, 1],
  ['ible', -1, 1],
  ['ante', -1, 1],
]

const a_5: Rule[] = [
  ['ic', -1, 1],
  ['abil', -1, 1],
  ['iv', -1, 1],
]

const a_6: Rule[] = [
  ['ica', -1, 1],
  ['ancia', -1, 2],
  ['encia', -1, 5],
  ['adora', -1, 2],
  ['osa', -1, 1],
  ['ista', -1, 1],
  ['iva', -1, 9],
  ['anza', -1, 1],
  ['log\u00EDa', -1, 3],
  ['idad', -1, 8],
  ['able', -1, 1],
  ['ible', -1, 1],
  ['ante', -1, 2],
  ['mente', -1, 7],
  ['amente', 13, 6],
  ['aci\u00F3n', -1, 2],
  ['uci\u00F3n', -1, 4],
  ['ico', -1, 1],
  ['ismo', -1, 1],
  ['oso', -1, 1],
  ['amiento', -1, 1],
  ['imiento', -1, 1],
  ['ivo', -1, 9],
  ['ador', -1, 2],
  ['icas', -1, 1],
  ['ancias', -1, 2],
  ['encias', -1, 5],
  ['adoras', -1, 2],
  ['osas', -1, 1],
  ['istas', -1, 1],
  ['ivas', -1, 9],
  ['anzas', -1, 1],
  ['log\u00EDas', -1, 3],
  ['idades', -1, 8],
  ['ables', -1, 1],
  ['ibles', -1, 1],
  ['aciones', -1, 2],
  ['uciones', -1, 4],
  ['adores', -1, 2],
  ['antes', -1, 2],
  ['icos', -1, 1],
  ['ismos', -1, 1],
  ['osos', -1, 1],
  ['amientos', -1, 1],
  ['imientos', -1, 1],
  ['ivos', -1, 9],
]

const a_7: Rule[] = [
  ['ya', -1, 1],
  ['ye', -1, 1],
  ['yan', -1, 1],
  ['yen', -1, 1],
  ['yeron', -1, 1],
  ['yendo', -1, 1],
  ['yo', -1, 1],
  ['yas', -1, 1],
  ['yes', -1, 1],
  ['yais', -1, 1],
  ['yamos', -1, 1],
  ['y\u00F3', -1, 1],
]

const a_8: Rule[] = [
  ['aba', -1, 2],
  ['ada', -1, 2],
  ['ida', -1, 2],
  ['ara', -1, 2],
  ['iera', -1, 2],
  ['\u00EDa', -1, 2],
  ['ar\u00EDa', 5, 2],
  ['er\u00EDa', 5, 2],
  ['ir\u00EDa', 5, 2],
  ['ad', -1, 2],
  ['ed', -1, 2],
  ['id', -1, 2],
  ['ase', -1, 2],
  ['iese', -1, 2],
  ['aste', -1, 2],
  ['iste', -1, 2],
  ['an', -1, 2],
  ['aban', 16, 2],
  ['aran', 16, 2],
  ['ieran', 16, 2],
  ['\u00EDan', 16, 2],
  ['ar\u00EDan', 20, 2],
  ['er\u00EDan', 20, 2],
  ['ir\u00EDan', 20, 2],
  ['en', -1, 1],
  ['asen', 24, 2],
  ['iesen', 24, 2],
  ['aron', -1, 2],
  ['ieron', -1, 2],
  ['ar\u00E1n', -1, 2],
  ['er\u00E1n', -1, 2],
  ['ir\u00E1n', -1, 2],
  ['ado', -1, 2],
  ['ido', -1, 2],
  ['ando', -1, 2],
  ['iendo', -1, 2],
  ['ar', -1, 2],
  ['er', -1, 2],
  ['ir', -1, 2],
  ['as', -1, 2],
  ['abas', 39, 2],
  ['adas', 39, 2],
  ['idas', 39, 2],
  ['aras', 39, 2],
  ['ieras', 39, 2],
  ['\u00EDas', 39, 2],
  ['ar\u00EDas', 45, 2],
  ['er\u00EDas', 45, 2],
  ['ir\u00EDas', 45, 2],
  ['es', -1, 1],
  ['ases', 49, 2],
  ['ieses', 49, 2],
  ['abais', -1, 2],
  ['arais', -1, 2],
  ['ierais', -1, 2],
  ['\u00EDais', -1, 2],
  ['ar\u00EDais', 55, 2],
  ['er\u00EDais', 55, 2],
  ['ir\u00EDais', 55, 2],
  ['aseis', -1, 2],
  ['ieseis', -1, 2],
  ['asteis', -1, 2],
  ['isteis', -1, 2],
  ['\u00E1is', -1, 2],
  ['\u00E9is', -1, 1],
  ['ar\u00E9is', 64, 2],
  ['er\u00E9is', 64, 2],
  ['ir\u00E9is', 64, 2],
  ['ados', -1, 2],
  ['idos', -1, 2],
  ['amos', -1, 2],
  ['\u00E1bamos', 70, 2],
  ['\u00E1ramos', 70, 2],
  ['i\u00E9ramos', 70, 2],
  ['\u00EDamos', 70, 2],
  ['ar\u00EDamos', 74, 2],
  ['er\u00EDamos', 74, 2],
  ['ir\u00EDamos', 74, 2],
  ['emos', -1, 1],
  ['aremos', 78, 2],
  ['eremos', 78, 2],
  ['iremos', 78, 2],
  ['\u00E1semos', 78, 2],
  ['i\u00E9semos', 78, 2],
  ['imos', -1, 2],
  ['ar\u00E1s', -1, 2],
  ['er\u00E1s', -1, 2],
  ['ir\u00E1s', -1, 2],
  ['\u00EDs', -1, 2],
  ['ar\u00E1', -1, 2],
  ['er\u00E1', -1, 2],
  ['ir\u00E1', -1, 2],
  ['ar\u00E9', -1, 2],
  ['er\u00E9', -1, 2],
  ['ir\u00E9', -1, 2],
  ['i\u00F3', -1, 2],
]

const a_9: Rule[] = [
  ['a', -1, 1],
  ['e', -1, 2],
  ['o', -1, 1],
  ['os', -1, 1],
  ['\u00E1', -1, 1],
  ['\u00E9', -1, 2],
  ['\u00ED', -1, 1],
  ['\u00F3', -1, 1],
]

const g_v = [17, 65, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 17, 4, 10]

/** Stemmer for the Spanish language */
export class SpanishStemmer extends Stemmer {
  private I_p2 = 0
  private I_p1 = 0
  private I_pV = 0

  private r_mark_regions() {
    this.I_pV = this.limit
    this.I_p1 = this.limit
    this.I_p2 = this.limit
    const v_1 = this.cursor
    lab0: {
      lab1: {
        const v_2 = this.cursor
        lab2: {
          if (!this.in_grouping(g_v, 97, 252)) {
            break lab2
          }
          lab3: {
            const v_3 = this.cursor
            lab4: {
              if (!this.out_grouping(g_v, 97, 252)) {
                break lab4
              }
              golab5: while (true) {
                lab6: {
                  if (!this.in_grouping(g_v, 97, 252)) {
                    break lab6
                  }
                  break golab5
                }
                if (this.cursor >= this.limit) {
                  break lab4
                }
                this.cursor++
              }
              break lab3
            }
            this.cursor = v_3
            if (!this.in_grouping(g_v, 97, 252)) {
              break lab2
            }
            golab7: while (true) {
              lab8: {
                if (!this.out_grouping(g_v, 97, 252)) {
                  break lab8
                }
                break golab7
              }
              if (this.cursor >= this.limit) {
                break lab2
              }
              this.cursor++
            }
          }
          break lab1
        }
        this.cursor = v_2
        if (!this.out_grouping(g_v, 97, 252)) {
          break lab0
        }
        lab9: {
          const v_6 = this.cursor
          lab10: {
            if (!this.out_grouping(g_v, 97, 252)) {
              break lab10
            }
            golab11: while (true) {
              lab12: {
                if (!this.in_grouping(g_v, 97, 252)) {
                  break lab12
                }
                break golab11
              }
              if (this.cursor >= this.limit) {
                break lab10
              }
              this.cursor++
            }
            break lab9
          }
          this.cursor = v_6
          if (!this.in_grouping(g_v, 97, 252)) {
            break lab0
          }
          if (this.cursor >= this.limit) {
            break lab0
          }
          this.cursor++
        }
      }
      this.I_pV = this.cursor
    }
    this.cursor = v_1
    const v_8 = this.cursor
    lab13: {
      golab14: while (true) {
        lab15: {
          if (!this.in_grouping(g_v, 97, 252)) {
            break lab15
          }
          break golab14
        }
        if (this.cursor >= this.limit) {
          break lab13
        }
        this.cursor++
      }
      golab16: while (true) {
        lab17: {
          if (!this.out_grouping(g_v, 97, 252)) {
            break lab17
          }
          break golab16
        }
        if (this.cursor >= this.limit) {
          break lab13
        }
        this.cursor++
      }
      this.I_p1 = this.cursor
      golab18: while (true) {
        lab19: {
          if (!this.in_grouping(g_v, 97, 252)) {
            break lab19
          }
          break golab18
        }
        if (this.cursor >= this.limit) {
          break lab13
        }
        this.cursor++
      }
      golab20: while (true) {
        lab21: {
          if (!this.out_grouping(g_v, 97, 252)) {
            break lab21
          }
          break golab20
        }
        if (this.cursor >= this.limit) {
          break lab13
        }
        this.cursor++
      }
      this.I_p2 = this.cursor
    }
    this.cursor = v_8
    return true
  }

  private r_postlude() {
    while (true) {
      const v_1 = this.cursor
      lab0: {
        this.bra = this.cursor
        const among_var = this.find_among(a_0)
        if (among_var == 0) {
          break lab0
        }
        this.ket = this.cursor
        switch (among_var) {
          case 1:
            if (!this.slice_from('a')) {
              return false
            }
            break
          case 2:
            if (!this.slice_from('e')) {
              return false
            }
            break
          case 3:
            if (!this.slice_from('i')) {
              return false
            }
            break
          case 4:
            if (!this.slice_from('o')) {
              return false
            }
            break
          case 5:
            if (!this.slice_from('u')) {
              return false
            }
            break
          case 6:
            if (this.cursor >= this.limit) {
              break lab0
            }
            this.cursor++
            break
        }
        continue
      }
      this.cursor = v_1
      break
    }
    return true
  }

  private r_RV() {
    if (!(this.I_pV <= this.cursor)) {
      return false
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

  private r_attached_pronoun() {
    this.ket = this.cursor
    if (this.find_among_b(a_1) == 0) {
      return false
    }
    this.bra = this.cursor
    const among_var = this.find_among_b(a_2)
    if (among_var == 0) {
      return false
    }
    if (!this.r_RV()) {
      return false
    }
    switch (among_var) {
      case 1:
        this.bra = this.cursor
        if (!this.slice_from('iendo')) {
          return false
        }
        break
      case 2:
        this.bra = this.cursor
        if (!this.slice_from('ando')) {
          return false
        }
        break
      case 3:
        this.bra = this.cursor
        if (!this.slice_from('ar')) {
          return false
        }
        break
      case 4:
        this.bra = this.cursor
        if (!this.slice_from('er')) {
          return false
        }
        break
      case 5:
        this.bra = this.cursor
        if (!this.slice_from('ir')) {
          return false
        }
        break
      case 6:
        if (!this.slice_del()) {
          return false
        }
        break
      case 7:
        if (!this.eq_s_b('u')) {
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        break
    }
    return true
  }

  private r_standard_suffix() {
    this.ket = this.cursor
    const among_var = this.find_among_b(a_6)
    if (among_var == 0) {
      return false
    }
    this.bra = this.cursor
    switch (among_var) {
      case 1:
        if (!this.r_R2()) {
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        break
      case 2: {
        if (!this.r_R2()) {
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        const v_1 = this.limit - this.cursor
        lab0: {
          this.ket = this.cursor
          if (!this.eq_s_b('ic')) {
            this.cursor = this.limit - v_1
            break lab0
          }
          this.bra = this.cursor
          if (!this.r_R2()) {
            this.cursor = this.limit - v_1
            break lab0
          }
          if (!this.slice_del()) {
            return false
          }
        }
        break
      }
      case 3:
        if (!this.r_R2()) {
          return false
        }
        if (!this.slice_from('log')) {
          return false
        }
        break
      case 4:
        if (!this.r_R2()) {
          return false
        }
        if (!this.slice_from('u')) {
          return false
        }
        break
      case 5:
        if (!this.r_R2()) {
          return false
        }
        if (!this.slice_from('ente')) {
          return false
        }
        break
      case 6: {
        if (!this.r_R1()) {
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        const v_2 = this.limit - this.cursor
        lab1: {
          this.ket = this.cursor
          const among_var = this.find_among_b(a_3)
          if (among_var == 0) {
            this.cursor = this.limit - v_2
            break lab1
          }
          this.bra = this.cursor
          if (!this.r_R2()) {
            this.cursor = this.limit - v_2
            break lab1
          }
          if (!this.slice_del()) {
            return false
          }
          switch (among_var) {
            case 1:
              this.ket = this.cursor
              if (!this.eq_s_b('at')) {
                this.cursor = this.limit - v_2
                break lab1
              }
              this.bra = this.cursor
              if (!this.r_R2()) {
                this.cursor = this.limit - v_2
                break lab1
              }
              if (!this.slice_del()) {
                return false
              }
              break
          }
        }
        break
      }
      case 7: {
        if (!this.r_R2()) {
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        const v_3 = this.limit - this.cursor
        lab2: {
          this.ket = this.cursor
          if (this.find_among_b(a_4) == 0) {
            this.cursor = this.limit - v_3
            break lab2
          }
          this.bra = this.cursor
          if (!this.r_R2()) {
            this.cursor = this.limit - v_3
            break lab2
          }
          if (!this.slice_del()) {
            return false
          }
        }
        break
      }
      case 8: {
        if (!this.r_R2()) {
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        const v_4 = this.limit - this.cursor
        lab3: {
          this.ket = this.cursor
          if (this.find_among_b(a_5) == 0) {
            this.cursor = this.limit - v_4
            break lab3
          }
          this.bra = this.cursor
          if (!this.r_R2()) {
            this.cursor = this.limit - v_4
            break lab3
          }
          if (!this.slice_del()) {
            return false
          }
        }
        break
      }
      case 9: {
        if (!this.r_R2()) {
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        const v_5 = this.limit - this.cursor
        lab4: {
          this.ket = this.cursor
          if (!this.eq_s_b('at')) {
            this.cursor = this.limit - v_5
            break lab4
          }
          this.bra = this.cursor
          if (!this.r_R2()) {
            this.cursor = this.limit - v_5
            break lab4
          }
          if (!this.slice_del()) {
            return false
          }
        }
        break
      }
    }
    return true
  }

  private r_y_verb_suffix() {
    if (this.cursor < this.I_pV) {
      return false
    }
    const v_2 = this.limit_backward
    this.limit_backward = this.I_pV
    this.ket = this.cursor
    if (this.find_among_b(a_7) == 0) {
      this.limit_backward = v_2
      return false
    }
    this.bra = this.cursor
    this.limit_backward = v_2
    if (!this.eq_s_b('u')) {
      return false
    }
    if (!this.slice_del()) {
      return false
    }
    return true
  }

  private r_verb_suffix() {
    if (this.cursor < this.I_pV) {
      return false
    }
    const v_2 = this.limit_backward
    this.limit_backward = this.I_pV
    this.ket = this.cursor
    const among_var = this.find_among_b(a_8)
    if (among_var == 0) {
      this.limit_backward = v_2
      return false
    }
    this.bra = this.cursor
    this.limit_backward = v_2
    switch (among_var) {
      case 1: {
        const v_3 = this.limit - this.cursor
        lab0: {
          if (!this.eq_s_b('u')) {
            this.cursor = this.limit - v_3
            break lab0
          }
          const v_4 = this.limit - this.cursor
          if (!this.eq_s_b('g')) {
            this.cursor = this.limit - v_3
            break lab0
          }
          this.cursor = this.limit - v_4
        }
        this.bra = this.cursor
        if (!this.slice_del()) {
          return false
        }
        break
      }
      case 2:
        if (!this.slice_del()) {
          return false
        }
        break
    }
    return true
  }

  private r_residual_suffix() {
    this.ket = this.cursor
    const among_var = this.find_among_b(a_9)
    if (among_var == 0) {
      return false
    }
    this.bra = this.cursor
    switch (among_var) {
      case 1:
        if (!this.r_RV()) {
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        break
      case 2: {
        if (!this.r_RV()) {
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        const v_1 = this.limit - this.cursor
        lab0: {
          this.ket = this.cursor
          if (!this.eq_s_b('u')) {
            this.cursor = this.limit - v_1
            break lab0
          }
          this.bra = this.cursor
          const v_2 = this.limit - this.cursor
          if (!this.eq_s_b('g')) {
            this.cursor = this.limit - v_1
            break lab0
          }
          this.cursor = this.limit - v_2
          if (!this.r_RV()) {
            this.cursor = this.limit - v_1
            break lab0
          }
          if (!this.slice_del()) {
            return false
          }
        }
        break
      }
    }
    return true
  }

  _stemHelper() {
    this.r_mark_regions()
    this.limit_backward = this.cursor
    this.cursor = this.limit
    const v_2 = this.limit - this.cursor
    this.r_attached_pronoun()
    this.cursor = this.limit - v_2
    const v_3 = this.limit - this.cursor
    lab0: {
      lab1: {
        const v_4 = this.limit - this.cursor
        lab2: {
          if (!this.r_standard_suffix()) {
            break lab2
          }
          break lab1
        }
        this.cursor = this.limit - v_4
        lab3: {
          if (!this.r_y_verb_suffix()) {
            break lab3
          }
          break lab1
        }
        this.cursor = this.limit - v_4
        if (!this.r_verb_suffix()) {
          break lab0
        }
      }
    }
    this.cursor = this.limit - v_3
    const v_5 = this.limit - this.cursor
    this.r_residual_suffix()
    this.cursor = this.limit - v_5
    this.cursor = this.limit_backward
    const v_6 = this.cursor
    this.r_postlude()
    this.cursor = v_6
    return true
  }
}

const spanishStemmer = new SpanishStemmer()

export const stem_es = (word: string): string => spanishStemmer.stem(word)
