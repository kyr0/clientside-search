import { Rule, Stemmer } from './stemmer'

const a_0: Rule[] = [
  ['col', -1, -1],
  ['par', -1, -1],
  ['tap', -1, -1],
]

const a_1: Rule[] = [
  ['', -1, 7],
  ['H', 0, 6],
  ['He', 1, 4],
  ['Hi', 1, 5],
  ['I', 0, 1],
  ['U', 0, 2],
  ['Y', 0, 3],
]

const a_2: Rule[] = [
  ['iqU', -1, 3],
  ['abl', -1, 3],
  ['I\u00E8r', -1, 4],
  ['i\u00E8r', -1, 4],
  ['eus', -1, 2],
  ['iv', -1, 1],
]

const a_3: Rule[] = [
  ['ic', -1, 2],
  ['abil', -1, 1],
  ['iv', -1, 3],
]

const a_4: Rule[] = [
  ['iqUe', -1, 1],
  ['atrice', -1, 2],
  ['ance', -1, 1],
  ['ence', -1, 5],
  ['logie', -1, 3],
  ['able', -1, 1],
  ['isme', -1, 1],
  ['euse', -1, 11],
  ['iste', -1, 1],
  ['ive', -1, 8],
  ['if', -1, 8],
  ['usion', -1, 4],
  ['ation', -1, 2],
  ['ution', -1, 4],
  ['ateur', -1, 2],
  ['iqUes', -1, 1],
  ['atrices', -1, 2],
  ['ances', -1, 1],
  ['ences', -1, 5],
  ['logies', -1, 3],
  ['ables', -1, 1],
  ['ismes', -1, 1],
  ['euses', -1, 11],
  ['istes', -1, 1],
  ['ives', -1, 8],
  ['ifs', -1, 8],
  ['usions', -1, 4],
  ['ations', -1, 2],
  ['utions', -1, 4],
  ['ateurs', -1, 2],
  ['ments', -1, 15],
  ['ements', 30, 6],
  ['issements', 31, 12],
  ['it\u00E9s', -1, 7],
  ['ment', -1, 15],
  ['ement', 34, 6],
  ['issement', 35, 12],
  ['amment', 34, 13],
  ['emment', 34, 14],
  ['aux', -1, 10],
  ['eaux', 39, 9],
  ['eux', -1, 1],
  ['it\u00E9', -1, 7],
]

const a_5: Rule[] = [
  ['ira', -1, 1],
  ['ie', -1, 1],
  ['isse', -1, 1],
  ['issante', -1, 1],
  ['i', -1, 1],
  ['irai', 4, 1],
  ['ir', -1, 1],
  ['iras', -1, 1],
  ['ies', -1, 1],
  ['\u00EEmes', -1, 1],
  ['isses', -1, 1],
  ['issantes', -1, 1],
  ['\u00EEtes', -1, 1],
  ['is', -1, 1],
  ['irais', 13, 1],
  ['issais', 13, 1],
  ['irions', -1, 1],
  ['issions', -1, 1],
  ['irons', -1, 1],
  ['issons', -1, 1],
  ['issants', -1, 1],
  ['it', -1, 1],
  ['irait', 21, 1],
  ['issait', 21, 1],
  ['issant', -1, 1],
  ['iraIent', -1, 1],
  ['issaIent', -1, 1],
  ['irent', -1, 1],
  ['issent', -1, 1],
  ['iront', -1, 1],
  ['\u00EEt', -1, 1],
  ['iriez', -1, 1],
  ['issiez', -1, 1],
  ['irez', -1, 1],
  ['issez', -1, 1],
]

const a_6: Rule[] = [
  ['a', -1, 3],
  ['era', 0, 2],
  ['asse', -1, 3],
  ['ante', -1, 3],
  ['\u00E9e', -1, 2],
  ['ai', -1, 3],
  ['erai', 5, 2],
  ['er', -1, 2],
  ['as', -1, 3],
  ['eras', 8, 2],
  ['\u00E2mes', -1, 3],
  ['asses', -1, 3],
  ['antes', -1, 3],
  ['\u00E2tes', -1, 3],
  ['\u00E9es', -1, 2],
  ['ais', -1, 3],
  ['erais', 15, 2],
  ['ions', -1, 1],
  ['erions', 17, 2],
  ['assions', 17, 3],
  ['erons', -1, 2],
  ['ants', -1, 3],
  ['\u00E9s', -1, 2],
  ['ait', -1, 3],
  ['erait', 23, 2],
  ['ant', -1, 3],
  ['aIent', -1, 3],
  ['eraIent', 26, 2],
  ['\u00E8rent', -1, 2],
  ['assent', -1, 3],
  ['eront', -1, 2],
  ['\u00E2t', -1, 3],
  ['ez', -1, 2],
  ['iez', 32, 2],
  ['eriez', 33, 2],
  ['assiez', 33, 3],
  ['erez', 32, 2],
  ['\u00E9', -1, 2],
]

const a_7: Rule[] = [
  ['e', -1, 3],
  ['I\u00E8re', 0, 2],
  ['i\u00E8re', 0, 2],
  ['ion', -1, 1],
  ['Ier', -1, 2],
  ['ier', -1, 2],
]

const a_8: Rule[] = [
  ['ell', -1, -1],
  ['eill', -1, -1],
  ['enn', -1, -1],
  ['onn', -1, -1],
  ['ett', -1, -1],
]

// deno-fmt-ignore
const g_v = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 130, 103, 8, 5]

const g_keep_with_s = [1, 65, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128]

/** Stemmer for the French language */
export class FrenchStemmer extends Stemmer {
  private I_p2 = 0
  private I_p1 = 0
  private I_pV = 0

  private r_prelude() {
    while (true) {
      const v_1 = this.cursor
      lab0: {
        golab1: while (true) {
          const v_2 = this.cursor
          lab2: {
            lab3: {
              const v_3 = this.cursor
              lab4: {
                if (!this.in_grouping(g_v, 97, 251)) {
                  break lab4
                }
                this.bra = this.cursor
                lab5: {
                  const v_4 = this.cursor
                  lab6: {
                    if (!this.eq_s('u')) {
                      break lab6
                    }
                    this.ket = this.cursor
                    if (!this.in_grouping(g_v, 97, 251)) {
                      break lab6
                    }
                    if (!this.slice_from('U')) {
                      return false
                    }
                    break lab5
                  }
                  this.cursor = v_4
                  lab7: {
                    if (!this.eq_s('i')) {
                      break lab7
                    }
                    this.ket = this.cursor
                    if (!this.in_grouping(g_v, 97, 251)) {
                      break lab7
                    }
                    if (!this.slice_from('I')) {
                      return false
                    }
                    break lab5
                  }
                  this.cursor = v_4
                  if (!this.eq_s('y')) {
                    break lab4
                  }
                  this.ket = this.cursor
                  if (!this.slice_from('Y')) {
                    return false
                  }
                }
                break lab3
              }
              this.cursor = v_3
              lab8: {
                this.bra = this.cursor
                if (!this.eq_s('\u00EB')) {
                  break lab8
                }
                this.ket = this.cursor
                if (!this.slice_from('He')) {
                  return false
                }
                break lab3
              }
              this.cursor = v_3
              lab9: {
                this.bra = this.cursor
                if (!this.eq_s('\u00EF')) {
                  break lab9
                }
                this.ket = this.cursor
                if (!this.slice_from('Hi')) {
                  return false
                }
                break lab3
              }
              this.cursor = v_3
              lab10: {
                this.bra = this.cursor
                if (!this.eq_s('y')) {
                  break lab10
                }
                this.ket = this.cursor
                if (!this.in_grouping(g_v, 97, 251)) {
                  break lab10
                }
                if (!this.slice_from('Y')) {
                  return false
                }
                break lab3
              }
              this.cursor = v_3
              if (!this.eq_s('q')) {
                break lab2
              }
              this.bra = this.cursor
              if (!this.eq_s('u')) {
                break lab2
              }
              this.ket = this.cursor
              if (!this.slice_from('U')) {
                return false
              }
            }
            this.cursor = v_2
            break golab1
          }
          this.cursor = v_2
          if (this.cursor >= this.limit) {
            break lab0
          }
          this.cursor++
        }
        continue
      }
      this.cursor = v_1
      break
    }
    return true
  }

  private r_mark_regions() {
    this.I_pV = this.limit
    this.I_p1 = this.limit
    this.I_p2 = this.limit
    const v_1 = this.cursor
    lab0: {
      lab1: {
        const v_2 = this.cursor
        lab2: {
          if (!this.in_grouping(g_v, 97, 251)) {
            break lab2
          }
          if (!this.in_grouping(g_v, 97, 251)) {
            break lab2
          }
          if (this.cursor >= this.limit) {
            break lab2
          }
          this.cursor++
          break lab1
        }
        this.cursor = v_2
        lab3: {
          if (this.find_among(a_0) == 0) {
            break lab3
          }
          break lab1
        }
        this.cursor = v_2
        if (this.cursor >= this.limit) {
          break lab0
        }
        this.cursor++
        golab4: while (true) {
          lab5: {
            if (!this.in_grouping(g_v, 97, 251)) {
              break lab5
            }
            break golab4
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
    const v_4 = this.cursor
    lab6: {
      golab7: while (true) {
        lab8: {
          if (!this.in_grouping(g_v, 97, 251)) {
            break lab8
          }
          break golab7
        }
        if (this.cursor >= this.limit) {
          break lab6
        }
        this.cursor++
      }
      golab9: while (true) {
        lab10: {
          if (!this.out_grouping(g_v, 97, 251)) {
            break lab10
          }
          break golab9
        }
        if (this.cursor >= this.limit) {
          break lab6
        }
        this.cursor++
      }
      this.I_p1 = this.cursor
      golab11: while (true) {
        lab12: {
          if (!this.in_grouping(g_v, 97, 251)) {
            break lab12
          }
          break golab11
        }
        if (this.cursor >= this.limit) {
          break lab6
        }
        this.cursor++
      }
      golab13: while (true) {
        lab14: {
          if (!this.out_grouping(g_v, 97, 251)) {
            break lab14
          }
          break golab13
        }
        if (this.cursor >= this.limit) {
          break lab6
        }
        this.cursor++
      }
      this.I_p2 = this.cursor
    }
    this.cursor = v_4
    return true
  }

  private r_postlude() {
    while (true) {
      const v_1 = this.cursor
      lab0: {
        this.bra = this.cursor
        const among_var = this.find_among(a_1)
        if (among_var == 0) {
          break lab0
        }
        this.ket = this.cursor
        switch (among_var) {
          case 1:
            if (!this.slice_from('i')) {
              return false
            }
            break
          case 2:
            if (!this.slice_from('u')) {
              return false
            }
            break
          case 3:
            if (!this.slice_from('y')) {
              return false
            }
            break
          case 4:
            if (!this.slice_from('\u00EB')) {
              return false
            }
            break
          case 5:
            if (!this.slice_from('\u00EF')) {
              return false
            }
            break
          case 6:
            if (!this.slice_del()) {
              return false
            }
            break
          case 7:
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

  private r_standard_suffix() {
    this.ket = this.cursor
    const among_var = this.find_among_b(a_4)
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
          lab1: {
            const v_2 = this.limit - this.cursor
            lab2: {
              if (!this.r_R2()) {
                break lab2
              }
              if (!this.slice_del()) {
                return false
              }
              break lab1
            }
            this.cursor = this.limit - v_2
            if (!this.slice_from('iqU')) {
              return false
            }
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
        if (!this.slice_from('ent')) {
          return false
        }
        break
      case 6: {
        if (!this.r_RV()) {
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        const v_3 = this.limit - this.cursor
        lab3: {
          this.ket = this.cursor
          const among_var = this.find_among_b(a_2)
          if (among_var == 0) {
            this.cursor = this.limit - v_3
            break lab3
          }
          this.bra = this.cursor
          switch (among_var) {
            case 1:
              if (!this.r_R2()) {
                this.cursor = this.limit - v_3
                break lab3
              }
              if (!this.slice_del()) {
                return false
              }
              this.ket = this.cursor
              if (!this.eq_s_b('at')) {
                this.cursor = this.limit - v_3
                break lab3
              }
              this.bra = this.cursor
              if (!this.r_R2()) {
                this.cursor = this.limit - v_3
                break lab3
              }
              if (!this.slice_del()) {
                return false
              }
              break
            case 2:
              lab4: {
                const v_4 = this.limit - this.cursor
                lab5: {
                  if (!this.r_R2()) {
                    break lab5
                  }
                  if (!this.slice_del()) {
                    return false
                  }
                  break lab4
                }
                this.cursor = this.limit - v_4
                if (!this.r_R1()) {
                  this.cursor = this.limit - v_3
                  break lab3
                }
                if (!this.slice_from('eux')) {
                  return false
                }
              }
              break
            case 3:
              if (!this.r_R2()) {
                this.cursor = this.limit - v_3
                break lab3
              }
              if (!this.slice_del()) {
                return false
              }
              break
            case 4:
              if (!this.r_RV()) {
                this.cursor = this.limit - v_3
                break lab3
              }
              if (!this.slice_from('i')) {
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
        const v_5 = this.limit - this.cursor
        lab6: {
          this.ket = this.cursor
          const among_var = this.find_among_b(a_3)
          if (among_var == 0) {
            this.cursor = this.limit - v_5
            break lab6
          }
          this.bra = this.cursor
          switch (among_var) {
            case 1:
              lab7: {
                const v_6 = this.limit - this.cursor
                lab8: {
                  if (!this.r_R2()) {
                    break lab8
                  }
                  if (!this.slice_del()) {
                    return false
                  }
                  break lab7
                }
                this.cursor = this.limit - v_6
                if (!this.slice_from('abl')) {
                  return false
                }
              }
              break
            case 2:
              lab9: {
                const v_7 = this.limit - this.cursor
                lab10: {
                  if (!this.r_R2()) {
                    break lab10
                  }
                  if (!this.slice_del()) {
                    return false
                  }
                  break lab9
                }
                this.cursor = this.limit - v_7
                if (!this.slice_from('iqU')) {
                  return false
                }
              }
              break
            case 3:
              if (!this.r_R2()) {
                this.cursor = this.limit - v_5
                break lab6
              }
              if (!this.slice_del()) {
                return false
              }
              break
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
        const v_8 = this.limit - this.cursor
        lab11: {
          this.ket = this.cursor
          if (!this.eq_s_b('at')) {
            this.cursor = this.limit - v_8
            break lab11
          }
          this.bra = this.cursor
          if (!this.r_R2()) {
            this.cursor = this.limit - v_8
            break lab11
          }
          if (!this.slice_del()) {
            return false
          }
          this.ket = this.cursor
          if (!this.eq_s_b('ic')) {
            this.cursor = this.limit - v_8
            break lab11
          }
          this.bra = this.cursor
          lab12: {
            const v_9 = this.limit - this.cursor
            lab13: {
              if (!this.r_R2()) {
                break lab13
              }
              if (!this.slice_del()) {
                return false
              }
              break lab12
            }
            this.cursor = this.limit - v_9
            if (!this.slice_from('iqU')) {
              return false
            }
          }
        }
        break
      }
      case 9:
        if (!this.slice_from('eau')) {
          return false
        }
        break
      case 10:
        if (!this.r_R1()) {
          return false
        }
        if (!this.slice_from('al')) {
          return false
        }
        break
      case 11:
        lab14: {
          const v_10 = this.limit - this.cursor
          lab15: {
            if (!this.r_R2()) {
              break lab15
            }
            if (!this.slice_del()) {
              return false
            }
            break lab14
          }
          this.cursor = this.limit - v_10
          if (!this.r_R1()) {
            return false
          }
          if (!this.slice_from('eux')) {
            return false
          }
        }
        break
      case 12:
        if (!this.r_R1()) {
          return false
        }
        if (!this.out_grouping_b(g_v, 97, 251)) {
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        break
      case 13:
        if (!this.r_RV()) {
          return false
        }
        if (!this.slice_from('ant')) {
          return false
        }
        return false
      case 14:
        if (!this.r_RV()) {
          return false
        }
        if (!this.slice_from('ent')) {
          return false
        }
        return false
      case 15: {
        const v_11 = this.limit - this.cursor
        if (!this.in_grouping_b(g_v, 97, 251)) {
          return false
        }
        if (!this.r_RV()) {
          return false
        }
        this.cursor = this.limit - v_11
        if (!this.slice_del()) {
          return false
        }
        return false
      }
    }
    return true
  }

  private r_i_verb_suffix() {
    if (this.cursor < this.I_pV) {
      return false
    }
    const v_2 = this.limit_backward
    this.limit_backward = this.I_pV
    this.ket = this.cursor
    if (this.find_among_b(a_5) == 0) {
      this.limit_backward = v_2
      return false
    }
    this.bra = this.cursor
    {
      const v_3 = this.limit - this.cursor
      lab0: {
        if (!this.eq_s_b('H')) {
          break lab0
        }
        this.limit_backward = v_2
        return false
      }
      this.cursor = this.limit - v_3
    }
    if (!this.out_grouping_b(g_v, 97, 251)) {
      this.limit_backward = v_2
      return false
    }
    if (!this.slice_del()) {
      return false
    }
    this.limit_backward = v_2
    return true
  }

  private r_verb_suffix() {
    if (this.cursor < this.I_pV) {
      return false
    }
    const v_2 = this.limit_backward
    this.limit_backward = this.I_pV
    this.ket = this.cursor
    const among_var = this.find_among_b(a_6)
    if (among_var == 0) {
      this.limit_backward = v_2
      return false
    }
    this.bra = this.cursor
    switch (among_var) {
      case 1:
        if (!this.r_R2()) {
          this.limit_backward = v_2
          return false
        }
        if (!this.slice_del()) {
          return false
        }
        break
      case 2:
        if (!this.slice_del()) {
          return false
        }
        break
      case 3: {
        if (!this.slice_del()) {
          return false
        }
        const v_3 = this.limit - this.cursor
        lab0: {
          this.ket = this.cursor
          if (!this.eq_s_b('e')) {
            this.cursor = this.limit - v_3
            break lab0
          }
          this.bra = this.cursor
          if (!this.slice_del()) {
            return false
          }
        }
        break
      }
    }
    this.limit_backward = v_2
    return true
  }

  private r_residual_suffix() {
    const v_1 = this.limit - this.cursor
    lab0: {
      this.ket = this.cursor
      if (!this.eq_s_b('s')) {
        this.cursor = this.limit - v_1
        break lab0
      }
      this.bra = this.cursor
      const v_2 = this.limit - this.cursor
      lab1: {
        const v_3 = this.limit - this.cursor
        lab2: {
          if (!this.eq_s_b('Hi')) {
            break lab2
          }
          break lab1
        }
        this.cursor = this.limit - v_3
        if (!this.out_grouping_b(g_keep_with_s, 97, 232)) {
          this.cursor = this.limit - v_1
          break lab0
        }
      }
      this.cursor = this.limit - v_2
      if (!this.slice_del()) {
        return false
      }
    }
    if (this.cursor < this.I_pV) {
      return false
    }
    const v_5 = this.limit_backward
    this.limit_backward = this.I_pV
    this.ket = this.cursor
    const among_var = this.find_among_b(a_7)
    if (among_var == 0) {
      this.limit_backward = v_5
      return false
    }
    this.bra = this.cursor
    switch (among_var) {
      case 1:
        if (!this.r_R2()) {
          this.limit_backward = v_5
          return false
        }
        lab3: {
          const v_6 = this.limit - this.cursor
          lab4: {
            if (!this.eq_s_b('s')) {
              break lab4
            }
            break lab3
          }
          this.cursor = this.limit - v_6
          if (!this.eq_s_b('t')) {
            this.limit_backward = v_5
            return false
          }
        }
        if (!this.slice_del()) {
          return false
        }
        break
      case 2:
        if (!this.slice_from('i')) {
          return false
        }
        break
      case 3:
        if (!this.slice_del()) {
          return false
        }
        break
    }
    this.limit_backward = v_5
    return true
  }

  private r_un_double() {
    const v_1 = this.limit - this.cursor
    if (this.find_among_b(a_8) == 0) {
      return false
    }
    this.cursor = this.limit - v_1
    this.ket = this.cursor
    if (this.cursor <= this.limit_backward) {
      return false
    }
    this.cursor--
    this.bra = this.cursor
    if (!this.slice_del()) {
      return false
    }
    return true
  }

  private r_un_accent() {
    {
      let v_1 = 1
      while (true) {
        lab0: {
          if (!this.out_grouping_b(g_v, 97, 251)) {
            break lab0
          }
          v_1--
          continue
        }
        break
      }
      if (v_1 > 0) {
        return false
      }
    }
    this.ket = this.cursor
    lab1: {
      const v_3 = this.limit - this.cursor
      lab2: {
        if (!this.eq_s_b('\u00E9')) {
          break lab2
        }
        break lab1
      }
      this.cursor = this.limit - v_3
      if (!this.eq_s_b('\u00E8')) {
        return false
      }
    }
    this.bra = this.cursor
    if (!this.slice_from('e')) {
      return false
    }
    return true
  }

  _stemHelper() {
    const v_1 = this.cursor
    this.r_prelude()
    this.cursor = v_1
    this.r_mark_regions()
    this.limit_backward = this.cursor
    this.cursor = this.limit
    const v_3 = this.limit - this.cursor
    lab0: {
      lab1: {
        const v_4 = this.limit - this.cursor
        lab2: {
          const v_5 = this.limit - this.cursor
          lab3: {
            const v_6 = this.limit - this.cursor
            lab4: {
              if (!this.r_standard_suffix()) {
                break lab4
              }
              break lab3
            }
            this.cursor = this.limit - v_6
            lab5: {
              if (!this.r_i_verb_suffix()) {
                break lab5
              }
              break lab3
            }
            this.cursor = this.limit - v_6
            if (!this.r_verb_suffix()) {
              break lab2
            }
          }
          this.cursor = this.limit - v_5
          const v_7 = this.limit - this.cursor
          lab6: {
            this.ket = this.cursor
            lab7: {
              const v_8 = this.limit - this.cursor
              lab8: {
                if (!this.eq_s_b('Y')) {
                  break lab8
                }
                this.bra = this.cursor
                if (!this.slice_from('i')) {
                  return false
                }
                break lab7
              }
              this.cursor = this.limit - v_8
              if (!this.eq_s_b('\u00E7')) {
                this.cursor = this.limit - v_7
                break lab6
              }
              this.bra = this.cursor
              if (!this.slice_from('c')) {
                return false
              }
            }
          }
          break lab1
        }
        this.cursor = this.limit - v_4
        if (!this.r_residual_suffix()) {
          break lab0
        }
      }
    }
    this.cursor = this.limit - v_3
    const v_9 = this.limit - this.cursor
    this.r_un_double()
    this.cursor = this.limit - v_9
    const v_10 = this.limit - this.cursor
    this.r_un_accent()
    this.cursor = this.limit - v_10
    this.cursor = this.limit_backward
    const v_11 = this.cursor
    this.r_postlude()
    this.cursor = v_11
    return true
  }
}

const frenchStemmer = new FrenchStemmer()

export const stem_fr = (word: string): string => frenchStemmer.stem(word)
