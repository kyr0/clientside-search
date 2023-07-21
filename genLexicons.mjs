import fs from 'fs'
import csv from 'csv-parser'
import { gzipSize } from 'gzip-size'
import prettyBytes from 'pretty-bytes'

// Path to your CSV file
const csvFilePath = './lexicon/en/LADECv1-2019.csv'

const wordsComponentSet = new Set()
const compoundSet = new Set()

function countWordFrequencies(wordsComponentSet, stimSet) {
  const frequencies = []

  for (const word of wordsComponentSet) {
    let frequency = 0

    for (const compound of stimSet) {
      if (compound.includes(word)) {
        frequency++
      }
    }

    frequencies.push({ word, frequency })
  }

  // Sort by highest frequency
  frequencies.sort((a, b) => b.frequency - a.frequency)

  return frequencies
}

function removeCompoundWords(words) {
  let wordSet = new Set(words)
  let cleanedWords = [...words]

  for (let word of words) {
    for (let i = 0; i < word.length; i++) {
      let part1 = word.substring(0, i)
      let part2 = word.substring(i)

      // check if both parts of the word exist in the word set
      if (wordSet.has(part1) && wordSet.has(part2)) {
        cleanedWords = cleanedWords.filter((w) => w !== word)
        break
      }
    }
  }
  return cleanedWords
}

let lexicon = []

// novel algorithm to isolate the distinct words of compound words
// in the english language according to the LADECv1-2019 dataset
// https://era.library.ualberta.ca/items/dc3b9033-14d0-48d7-b6fa-6398a30e61e4
// https://link.springer.com/article/10.3758/s13428-019-01282-6
// Gagné, CL., Spalding, TL., & Schmidtke, D. (2019).
// LADEC: Large database of English compounds. Behaviour Research Methods.
const run = async () => {
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const result = {
        c1: row['c1'],
        c2: row['c2'],
        stim: row['stim'],
        isCommonstim: row['isCommonstim'],
        Zipfvalue: row['Zipfvalue'],
      }
      if (result.isCommonstim === '1' && parseFloat(result.Zipfvalue) >= 2.9) {
        wordsComponentSet.add(result.c1)
        wordsComponentSet.add(result.c2)
        compoundSet.add(result.stim)
      }
    })
    .on('end', async () => {
      countWordFrequencies(wordsComponentSet, compoundSet).forEach((item) => lexicon.push(item.word))
      lexicon = removeCompoundWords(lexicon)

      fs.writeFileSync('./src/lexicon/en/compound_words.json', JSON.stringify(lexicon))
      console.log('CSV file successfully processed:', prettyBytes(await gzipSize(lexicon.join(' '))))
    })
}
await run()
