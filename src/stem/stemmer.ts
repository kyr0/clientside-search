export type Rule = [string, number, number] | [string, number, number, (stemmer: Stemmer) => boolean]

/** Used for stemming a specific language */
export abstract class Stemmer {
  current!: string
  cursor!: number
  limit!: number
  limit_backward!: number
  bra!: number
  ket!: number

  /** Constructs the stem */
  abstract _stemHelper(): void

  /** The stem of lowercase `word` */
  stem(word: string): string {
    this.current = word
    this.cursor = 0
    this.limit = this.current.length
    this.limit_backward = 0
    this.bra = this.cursor
    this.ket = this.limit
    this._stemHelper()
    return this.current
  }

  protected in_grouping(s: number[], min: number, max: number) {
    if (this.cursor >= this.limit) return false
    let ch = this.current.charCodeAt(this.cursor)
    if (ch > max || ch < min) return false
    ch -= min
    if ((s[ch >>> 3] & (0x1 << (ch & 0x7))) == 0) return false
    this.cursor++
    return true
  }

  protected in_grouping_b(s: number[], min: number, max: number) {
    if (this.cursor <= this.limit_backward) return false
    let ch = this.current.charCodeAt(this.cursor - 1)
    if (ch > max || ch < min) return false
    ch -= min
    if ((s[ch >>> 3] & (0x1 << (ch & 0x7))) == 0) return false
    this.cursor--
    return true
  }

  protected out_grouping(s: number[], min: number, max: number) {
    if (this.cursor >= this.limit) return false
    let ch = this.current.charCodeAt(this.cursor)
    if (ch > max || ch < min) {
      this.cursor++
      return true
    }
    ch -= min
    if ((s[ch >>> 3] & (0x1 << (ch & 0x7))) == 0) {
      this.cursor++
      return true
    }
    return false
  }

  protected out_grouping_b(s: number[], min: number, max: number) {
    if (this.cursor <= this.limit_backward) return false
    let ch = this.current.charCodeAt(this.cursor - 1)
    if (ch > max || ch < min) {
      this.cursor--
      return true
    }
    ch -= min
    if ((s[ch >>> 3] & (0x1 << (ch & 0x7))) == 0) {
      this.cursor--
      return true
    }
    return false
  }

  protected eq_s(s: string) {
    if (this.limit - this.cursor < s.length) return false
    if (this.current.slice(this.cursor, this.cursor + s.length) != s) {
      return false
    }
    this.cursor += s.length
    return true
  }

  protected eq_s_b(s: string) {
    if (this.cursor - this.limit_backward < s.length) return false
    if (this.current.slice(this.cursor - s.length, this.cursor) != s) {
      return false
    }
    this.cursor -= s.length
    return true
  }

  protected find_among(v: Rule[]) {
    let i = 0
    let j = v.length

    const c = this.cursor
    const l = this.limit

    let common_i = 0
    let common_j = 0

    let first_key_inspected = false

    while (true) {
      const k = i + ((j - i) >>> 1)
      let diff = 0
      let common = common_i < common_j ? common_i : common_j // smaller
      // w[0]: string, w[1]: substring_i, w[2]: result, w[3]: function (optional)
      const w = v[k]
      let i2
      for (i2 = common; i2 < w[0].length; i2++) {
        if (c + common == l) {
          diff = -1
          break
        }
        diff = this.current.charCodeAt(c + common) - w[0].charCodeAt(i2)
        if (diff != 0) break
        common++
      }
      if (diff < 0) {
        j = k
        common_j = common
      } else {
        i = k
        common_i = common
      }
      if (j - i <= 1) {
        if (i > 0) break // v->s has been inspected
        if (j == i) break // only one item in v
        if (first_key_inspected) break
        first_key_inspected = true
      }
    }
    do {
      const w = v[i]
      if (common_i >= w[0].length) {
        this.cursor = c + w[0].length
        if (w.length < 4) return w[2]
        const res = w[3]!(this)
        this.cursor = c + w[0].length
        if (res) return w[2]
      }
      i = w[1]
    } while (i >= 0)
    return 0
  }

  protected find_among_b(v: Rule[]) {
    let i = 0
    let j = v.length

    const c = this.cursor
    const lb = this.limit_backward

    let common_i = 0
    let common_j = 0

    let first_key_inspected = false

    while (true) {
      const k = i + ((j - i) >> 1)
      let diff = 0
      let common = common_i < common_j ? common_i : common_j
      const w = v[k]
      let i2
      for (i2 = w[0].length - 1 - common; i2 >= 0; i2--) {
        if (c - common == lb) {
          diff = -1
          break
        }
        diff = this.current.charCodeAt(c - 1 - common) - w[0].charCodeAt(i2)
        if (diff != 0) break
        common++
      }
      if (diff < 0) {
        j = k
        common_j = common
      } else {
        i = k
        common_i = common
      }
      if (j - i <= 1) {
        if (i > 0) break
        if (j == i) break
        if (first_key_inspected) break
        first_key_inspected = true
      }
    }
    do {
      const w = v[i]
      if (common_i >= w[0].length) {
        this.cursor = c - w[0].length
        if (w.length < 4) return w[2]
        const res = w[3]!(this)
        this.cursor = c - w[0].length
        if (res) return w[2]
      }
      i = w[1]
    } while (i >= 0)
    return 0
  }

  protected replace_s(c_bra: number, c_ket: number, s: string) {
    const adjustment = s.length - (c_ket - c_bra)
    this.current = this.current.slice(0, c_bra) + s + this.current.slice(c_ket)
    this.limit += adjustment
    if (this.cursor >= c_ket) this.cursor += adjustment
    else if (this.cursor > c_bra) this.cursor = c_bra
    return adjustment
  }

  protected slice_check() {
    if (this.bra < 0 || this.bra > this.ket || this.ket > this.limit || this.limit > this.current.length) {
      return false
    }
    return true
  }

  protected slice_from(s: string) {
    let result = false
    if (this.slice_check()) {
      this.replace_s(this.bra, this.ket, s)
      result = true
    }
    return result
  }

  protected slice_del() {
    return this.slice_from('')
  }

  protected insert(c_bra: number, c_ket: number, s: string) {
    const adjustment = this.replace_s(c_bra, c_ket, s)
    if (c_bra <= this.bra) this.bra += adjustment
    if (c_bra <= this.ket) this.ket += adjustment
  }

  protected slice_to() {
    let result = ''
    if (this.slice_check()) {
      result = this.current.slice(this.bra, this.ket)
    }
    return result
  }
}
