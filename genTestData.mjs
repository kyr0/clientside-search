import * as tldr from 'wikipedia-tldr'
const { default: getArticle } = tldr
import { readFileSync, writeFileSync } from 'fs'

async function delayedGetArticle(articleName, delay) {
  console.log('Fetching article: ' + articleName)
  await new Promise((resolve) => setTimeout(resolve, delay))
  return await getArticle(articleName)
}

function getRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length)
}

const articleNames = [
  'neuroscience',
  'artificial_intelligence',
  'genetics',
  'biochemistry',
  'nanotechnology',
  'ecology',
  'climate_change',
  'cognitive_science',
  'epistemology',
  'ethics',
  'linguistics',
  'semiotics',
  'statistics',
  'calculus',
  'geometry',
  'cybernetics',
  'telecommunication',
  'robotics',
  'astronomy',
  'cosmology',
  'information',
  'data',
  'computer',
  'technology',
  'somatology',
  'sociology',
  'psychology',
  'philosophy',
  'biology',
  'anatomy',
  'physiology',
  'medicine',
  'health',
  'disease',
  'death',
  'life',
  'human',
  'animal',
  'plant',
  'cell',
  'molecule',
  'atom',
  'particle',
  'quantum',
  'physics',
  'chemistry',
  'mathematics',
  'logic',
  'language',
  'communication',
]

const run = async () => {
  const wikipediaArticles = []
  for (let i = getRandomIndex(articleNames); i < articleNames.length; i++) {
    if (!articleNames[i]) break
    wikipediaArticles.push(await delayedGetArticle(articleNames[i], 500))
  }

  const storedArticles = JSON.parse(readFileSync('wikipediaArticles.json', 'utf8'))

  const data = wikipediaArticles
    .map((article) =>
      article
        ? {
            term: article.query,
            text: article.extract,
            metadata: {
              id: article.wikibase_item,
              title: article.title,
              lang: article.lang,
            },
          }
        : null,
    )
    .filter((article) => article)

  storedArticles.push(...data)

  function removeDuplicatesByTerm(arr) {
    const seenTerms = new Map()
    return arr.filter((item) => {
      if (seenTerms.has(item.term)) {
        return false
      } else {
        seenTerms.set(item.term, true)
        return true
      }
    })
  }

  const uniqueArticles = removeDuplicatesByTerm(storedArticles)

  writeFileSync('wikipediaArticles.json', JSON.stringify(uniqueArticles, null, 2))

  if (uniqueArticles.length !== storedArticles.length) {
    await run()
  }
}
await run()
