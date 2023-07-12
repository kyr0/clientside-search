export const stem_de = (word: string): string => {
  word = word.replace(/([aeiouyäöü])u([aeiouyäöü])/g, '$1U$2')
  word = word.replace(/([aeiouyäöü])y([aeiouyäöü])/g, '$1Y$2')

  word = word.replace(/ß/g, 'ss')

  let r1Index = word.search(/[aeiouyäöü][^aeiouyäöü]/)
  let r1 = ''
  if (r1Index !== -1) {
    r1Index += 2
    r1 = word.substring(r1Index)
  }

  let r2Index = -1
  if (r1Index !== -1) {
    r2Index = r1.search(/[aeiouyäöü][^aeiouyäöü]/)
    if (r2Index !== -1) {
      r2Index += 2
      r2Index += r1Index
    }
  }

  if (r1Index !== -1 && r1Index < 3) {
    r1Index = 3
    r1 = word.substring(r1Index)
  }

  const a1Index = word.search(/(em|ern|er)$/g)
  const b1Index = word.search(/(e|en|es)$/g)
  let c1Index = word.search(/([bdfghklmnrt]s)$/g)
  if (c1Index !== -1) {
    c1Index++
  }
  let index1 = 10000
  let optionUsed1 = ''
  if (a1Index !== -1 && a1Index < index1) {
    optionUsed1 = 'a'
    index1 = a1Index
  }
  if (b1Index !== -1 && b1Index < index1) {
    optionUsed1 = 'b'
    index1 = b1Index
  }
  if (c1Index !== -1 && c1Index < index1) {
    optionUsed1 = 'c'
    index1 = c1Index
  }

  if (index1 !== 10000 && r1Index !== -1) {
    if (index1 >= r1Index) {
      word = word.substring(0, index1)
      if (optionUsed1 === 'b') {
        if (word.search(/niss$/) !== -1) {
          word = word.substring(0, word.length - 1)
        }
      }
    }
  }

  const a2Index = word.search(/(en|er|est)$/g)
  let b2Index = word.search(/(.{3}[bdfghklmnt]st)$/g)
  if (b2Index !== -1) {
    b2Index += 4
  }

  let index2 = 10000
  if (a2Index !== -1 && a2Index < index2) {
    index2 = a2Index
  }
  if (b2Index !== -1 && b2Index < index2) {
    index2 = b2Index
  }

  if (index2 !== 10000 && r1Index !== -1) {
    if (index2 >= r1Index) {
      word = word.substring(0, index2)
    }
  }

  const a3Index = word.search(/(end|ung)$/g)
  let b3Index = word.search(/[^e](ig|ik|isch)$/g)
  const c3Index = word.search(/(lich|heit)$/g)
  const d3Index = word.search(/(keit)$/g)
  if (b3Index !== -1) {
    b3Index++
  }

  let index3 = 10000
  let optionUsed3 = ''
  if (a3Index !== -1 && a3Index < index3) {
    optionUsed3 = 'a'
    index3 = a3Index
  }
  if (b3Index !== -1 && b3Index < index3) {
    optionUsed3 = 'b'
    index3 = b3Index
  }
  if (c3Index !== -1 && c3Index < index3) {
    optionUsed3 = 'c'
    index3 = c3Index
  }
  if (d3Index !== -1 && d3Index < index3) {
    optionUsed3 = 'd'
    index3 = d3Index
  }

  if (index3 !== 10000 && r2Index !== -1) {
    if (index3 >= r2Index) {
      word = word.substring(0, index3)
      let optionIndex = -1
      if (optionUsed3 === 'a') {
        optionIndex = word.search(/[^e](ig)$/)
        if (optionIndex !== -1) {
          optionIndex++
          if (optionIndex >= r2Index) {
            word = word.substring(0, optionIndex)
          }
        }
      } else if (optionUsed3 === 'c') {
        optionIndex = word.search(/(er|en)$/)
        if (optionIndex !== -1) {
          if (optionIndex >= r1Index) {
            word = word.substring(0, optionIndex)
          }
        }
      } else if (optionUsed3 === 'd') {
        optionIndex = word.search(/(lich|ig)$/)
        if (optionIndex !== -1) {
          if (optionIndex >= r2Index) {
            word = word.substring(0, optionIndex)
          }
        }
      }
    }
  }

  word = word.replace(/U/g, 'u')
  word = word.replace(/Y/g, 'y')
  word = word.replace(/ä/g, 'a')
  word = word.replace(/ö/g, 'o')
  word = word.replace(/ü/g, 'u')

  return word
}
