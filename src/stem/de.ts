import { Rule, Stemmer } from './stemmer'

const a_0: Rule[] = [
  ['', -1, 5],
  ['ae', 0, 2],
  ['oe', 0, 3],
  ['qu', 0, -1],
  ['ue', 0, 4],
  ['\u00DF', 0, 1],
]

const a_1: Rule[] = [
  ['', -1, 5],
  ['U', 0, 2],
  ['Y', 0, 1],
  ['\u00E4', 0, 3],
  ['\u00F6', 0, 4],
  ['\u00FC', 0, 2],
]

const a_2: Rule[] = [
  ['e', -1, 2],
  ['em', -1, 1],
  ['en', -1, 2],
  ['ern', -1, 1],
  ['er', -1, 1],
  ['s', -1, 3],
  ['es', 5, 2],
]

const a_3: Rule[] = [
  ['en', -1, 1],
  ['er', -1, 1],
  ['st', -1, 2],
  ['est', 2, 1],
]

const a_4: Rule[] = [
  ['ig', -1, 1],
  ['lich', -1, 1],
]

const a_5: Rule[] = [
  ['end', -1, 1],
  ['ig', -1, 2],
  ['ung', -1, 1],
  ['lich', -1, 3],
  ['isch', -1, 2],
  ['ik', -1, 2],
  ['heit', -1, 3],
  ['keit', -1, 4],
]

const g_v = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 32, 8]

const g_s_ending = [117, 30, 5]

const g_st_ending = [117, 30, 4]

/** Alternative stemmer for the German language */
export class German2Stemmer extends Stemmer {
  private I_x = 0
  private I_p2 = 0
  private I_p1 = 0

  private r_prelude() {
    const v_1 = this.cursor
    while (true) {
      const v_2 = this.cursor
      lab0: {
        golab1: while (true) {
          const v_3 = this.cursor
          lab2: {
            if (!this.in_grouping(g_v, 97, 252)) {
              break lab2
            }
            this.bra = this.cursor
            lab3: {
              const v_4 = this.cursor
              lab4: {
                if (!this.eq_s('u')) {
                  break lab4
                }
                this.ket = this.cursor
                if (!this.in_grouping(g_v, 97, 252)) {
                  break lab4
                }
                if (!this.slice_from('U')) {
                  return false
                }
                break lab3
              }
              this.cursor = v_4
              if (!this.eq_s('y')) {
                break lab2
              }
              this.ket = this.cursor
              if (!this.in_grouping(g_v, 97, 252)) {
                break lab2
              }
              if (!this.slice_from('Y')) {
                return false
              }
            }
            this.cursor = v_3
            break golab1
          }
          this.cursor = v_3
          if (this.cursor >= this.limit) {
            break lab0
          }
          this.cursor++
        }
        continue
      }
      this.cursor = v_2
      break
    }
    this.cursor = v_1
    while (true) {
      const v_5 = this.cursor
      lab5: {
        this.bra = this.cursor
        const among_var = this.find_among(a_0)
        if (among_var == 0) {
          break lab5
        }
        this.ket = this.cursor
        switch (among_var) {
          case 1:
            if (!this.slice_from('ss')) {
              return false
            }
            break
          case 2:
            if (!this.slice_from('\u00E4')) {
              return false
            }
            break
          case 3:
            if (!this.slice_from('\u00F6')) {
              return false
            }
            break
          case 4:
            if (!this.slice_from('\u00FC')) {
              return false
            }
            break
          case 5:
            if (this.cursor >= this.limit) {
              break lab5
            }
            this.cursor++
            break
        }
        continue
      }
      this.cursor = v_5
      break
    }
    return true
  }

  private r_mark_regions() {
    this.I_p1 = this.limit
    this.I_p2 = this.limit
    const v_1 = this.cursor
    {
      const c1 = this.cursor + 3
      if (c1 > this.limit) {
        return false
      }
      this.cursor = c1
    }
    this.I_x = this.cursor
    this.cursor = v_1
    golab0: while (true) {
      lab1: {
        if (!this.in_grouping(g_v, 97, 252)) {
          break lab1
        }
        break golab0
      }
      if (this.cursor >= this.limit) {
        return false
      }
      this.cursor++
    }
    golab2: while (true) {
      lab3: {
        if (!this.out_grouping(g_v, 97, 252)) {
          break lab3
        }
        break golab2
      }
      if (this.cursor >= this.limit) {
        return false
      }
      this.cursor++
    }
    this.I_p1 = this.cursor
    lab4: {
      if (!(this.I_p1 < this.I_x)) {
        break lab4
      }
      this.I_p1 = this.I_x
    }
    golab5: while (true) {
      lab6: {
        if (!this.in_grouping(g_v, 97, 252)) {
          break lab6
        }
        break golab5
      }
      if (this.cursor >= this.limit) {
        return false
      }
      this.cursor++
    }
    golab7: while (true) {
      lab8: {
        if (!this.out_grouping(g_v, 97, 252)) {
          break lab8
        }
        break golab7
      }
      if (this.cursor >= this.limit) {
        return false
      }
      this.cursor++
    }
    this.I_p2 = this.cursor
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
            if (!this.slice_from('y')) {
              return false
            }
            break
          case 2:
            if (!this.slice_from('u')) {
              return false
            }
            break
          case 3:
            if (!this.slice_from('a')) {
              return false
            }
            break
          case 4:
            if (!this.slice_from('o')) {
              return false
            }
            break
          case 5:
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
    const v_1 = this.limit - this.cursor
    lab0: {
      this.ket = this.cursor
      const among_var = this.find_among_b(a_2)
      if (among_var == 0) {
        break lab0
      }
      this.bra = this.cursor
      if (!this.r_R1()) {
        break lab0
      }
      switch (among_var) {
        case 1:
          if (!this.slice_del()) {
            return false
          }
          break
        case 2: {
          if (!this.slice_del()) {
            return false
          }
          const v_2 = this.limit - this.cursor
          lab1: {
            this.ket = this.cursor
            if (!this.eq_s_b('s')) {
              this.cursor = this.limit - v_2
              break lab1
            }
            this.bra = this.cursor
            if (!this.eq_s_b('nis')) {
              this.cursor = this.limit - v_2
              break lab1
            }
            if (!this.slice_del()) {
              return false
            }
          }
          break
        }
        case 3:
          if (!this.in_grouping_b(g_s_ending, 98, 116)) {
            break lab0
          }
          if (!this.slice_del()) {
            return false
          }
          break
      }
    }
    this.cursor = this.limit - v_1
    const v_3 = this.limit - this.cursor
    lab2: {
      this.ket = this.cursor
      const among_var = this.find_among_b(a_3)
      if (among_var == 0) {
        break lab2
      }
      this.bra = this.cursor
      if (!this.r_R1()) {
        break lab2
      }
      switch (among_var) {
        case 1:
          if (!this.slice_del()) {
            return false
          }
          break
        case 2:
          if (!this.in_grouping_b(g_st_ending, 98, 116)) {
            break lab2
          }
          {
            const c1 = this.cursor - 3
            if (c1 < this.limit_backward) {
              break lab2
            }
            this.cursor = c1
          }
          if (!this.slice_del()) {
            return false
          }
          break
      }
    }
    this.cursor = this.limit - v_3
    const v_4 = this.limit - this.cursor
    lab3: {
      this.ket = this.cursor
      const among_var = this.find_among_b(a_5)
      if (among_var == 0) {
        break lab3
      }
      this.bra = this.cursor
      if (!this.r_R2()) {
        break lab3
      }
      switch (among_var) {
        case 1: {
          if (!this.slice_del()) {
            return false
          }
          const v_5 = this.limit - this.cursor
          lab4: {
            this.ket = this.cursor
            if (!this.eq_s_b('ig')) {
              this.cursor = this.limit - v_5
              break lab4
            }
            this.bra = this.cursor
            {
              const v_6 = this.limit - this.cursor
              lab5: {
                if (!this.eq_s_b('e')) {
                  break lab5
                }
                this.cursor = this.limit - v_5
                break lab4
              }
              this.cursor = this.limit - v_6
            }
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
        case 2:
          {
            const v_7 = this.limit - this.cursor
            lab6: {
              if (!this.eq_s_b('e')) {
                break lab6
              }
              break lab3
            }
            this.cursor = this.limit - v_7
          }
          if (!this.slice_del()) {
            return false
          }
          break
        case 3: {
          if (!this.slice_del()) {
            return false
          }
          const v_8 = this.limit - this.cursor
          lab7: {
            this.ket = this.cursor
            lab8: {
              const v_9 = this.limit - this.cursor
              lab9: {
                if (!this.eq_s_b('er')) {
                  break lab9
                }
                break lab8
              }
              this.cursor = this.limit - v_9
              if (!this.eq_s_b('en')) {
                this.cursor = this.limit - v_8
                break lab7
              }
            }
            this.bra = this.cursor
            if (!this.r_R1()) {
              this.cursor = this.limit - v_8
              break lab7
            }
            if (!this.slice_del()) {
              return false
            }
          }
          break
        }
        case 4: {
          if (!this.slice_del()) {
            return false
          }
          const v_10 = this.limit - this.cursor
          lab10: {
            this.ket = this.cursor
            if (this.find_among_b(a_4) == 0) {
              this.cursor = this.limit - v_10
              break lab10
            }
            this.bra = this.cursor
            if (!this.r_R2()) {
              this.cursor = this.limit - v_10
              break lab10
            }
            if (!this.slice_del()) {
              return false
            }
          }
          break
        }
      }
    }
    this.cursor = this.limit - v_4
    return true
  }

  _stemHelper() {
    const v_1 = this.cursor
    this.r_prelude()
    this.cursor = v_1
    const v_2 = this.cursor
    this.r_mark_regions()
    this.cursor = v_2
    this.limit_backward = this.cursor
    this.cursor = this.limit
    this.r_standard_suffix()
    this.cursor = this.limit_backward
    const v_4 = this.cursor
    this.r_postlude()
    this.cursor = v_4
    return true
  }
}

const german2Stemmer = new German2Stemmer()

export const stem_de = (word: string): string => german2Stemmer.stem(word)
