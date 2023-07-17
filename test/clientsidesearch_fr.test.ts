import { SearchEngine } from '../dist/index.esm'
import language from '../dist/fr.esm'
import { readFileSync } from 'fs'
import { gzipSize } from 'gzip-size'
import prettyBytes from 'pretty-bytes'

const wikipediaArticles = JSON.parse(readFileSync('./wikipediaArticles_fr.json', 'utf8'))

describe('SearchEngine fr', () => {
  let searchEngine: SearchEngine

  beforeEach(() => {
    searchEngine = new SearchEngine(language) // use default stopwords and ngramRange
    searchEngine.addDocument('Le vif renard brun saute par-dessus le chien paresseux.', {
      id: 'paresseux',
      debugStemmed: searchEngine.processText('Le vif renard brun saute par-dessus le chien paresseux.').join(' '),
    })
    searchEngine.addDocument('Le vif renard brun saute par-dessus la clôture. ✅', {
      id: 'cloture',
      debugStemmed: searchEngine.processText('Le vif renard brun saute par-dessus la clôture. ✅').join(' '),
    })
  })

  test('should create a new instance correctly', () => {
    expect(searchEngine).toBeInstanceOf(SearchEngine)
    expect(searchEngine.stopWords).toEqual(new Set(language.stopwords))
  })

  test('should correctly process text', () => {
    const processedText = searchEngine.processText('Le vif renard brun saute par-dessus le chien paresseux.')

    // Assuming stem_en stemming function turns "jumps" into "jump"
    // 'the' and 'over' have been removed as they are stop words
    const expectedText = ['renard', 'brun', 'saut', 'chien', 'paress']

    expect(processedText).toEqual(expectedText)
  })

  test('should match with phonetics when levensthein distance is similar', () => {
    const res = searchEngine.search('parresseux')
    expect(res[0].metadata.id).toEqual('paresseux')
  })

  test('should search for a query correctly', () => {
    const doc1 = "C'est un document de test."
    const doc2 = 'Ce document concerne les tests.'
    const doc3 = "C'est un document-test."
    searchEngine.addDocument(doc1, { stemmed: searchEngine.processText(doc1) })
    searchEngine.addDocument(doc2, { stemmed: searchEngine.processText(doc2) })
    searchEngine.addDocument(doc3, { stemmed: searchEngine.processText(doc3) })

    const result = searchEngine.search('concerne')
    expect(result.length).toBeGreaterThanOrEqual(1)

    expect(result[0].metadata.stemmed[1]).toEqual('concern')
  })

  test('should remove a document correctly', () => {
    const doc = "C'est un document de test."
    const docId3 = searchEngine.addDocument(doc)
    searchEngine.removeDocument(docId3)
    expect(searchEngine.documents[docId3]).toBeUndefined()

    const result = searchEngine.search('test')
    expect(result.length).toBe(0)
  })

  test('should serialize and deserialize correctly using hydrateState and fromHydratedState', async () => {
    const hydratedState = searchEngine.hydrateState()

    expect(JSON.parse(hydratedState).iso2Language).toEqual(language.iso2Language)

    const size = await gzipSize(hydratedState).catch(() => 0)
    console.log('INDEX SIZE', prettyBytes(size), '(gzip)')

    const hydratedEngine = SearchEngine.fromHydratedState(hydratedState, language)

    expect(hydratedEngine).toBeInstanceOf(SearchEngine)
    expect(hydratedEngine.stemmedDocuments).toEqual(searchEngine.stemmedDocuments)
    expect(hydratedEngine.ngramRange).toEqual(searchEngine.ngramRange)

    const result = hydratedEngine.search('clôture')

    // can it handle UTF8 characters?
    const result2 = hydratedEngine.search(' ✅')
    const result3 = hydratedEngine.search('✅')

    expect(result.length).toBe(1)
    expect(result[0].metadata.debugStemmed).toEqual('renard brun saut clôtur ✅')
    expect(result2.length).toBe(1)
    expect(result3.length).toBe(1)
  })

  test('add and search wikipedia articles', async () => {
    const origDocs: any = []

    wikipediaArticles.forEach((article: any) => {
      /** e.g.: article == {
        term: 'information',
        text: 'Information is an abstract concept that refers to that which has the power to inform. At the most fundamental level, information pertains to the interpretation of that which may be sensed, or their abstractions. Any natural process that is not completely random and any observable pattern in any medium can be said to convey some amount of information. Whereas digital signals and other data use discrete signs to convey information, other phenomena and artefacts such as analogue signals, poems, pictures, music or other sounds, and currents convey information in a more continuous form. Information is not knowledge itself, but the meaning that may be derived from a representation through interpretation.',
        metadata: { id: 'Q11028', index_title: 'Information', lang: 'en' }
      }, */
      searchEngine.addDocument(article.text, article.metadata)

      origDocs.push({
        text: article.text,
        metadata: article.metadata,
      })
    })

    const sizeOrig = await gzipSize(JSON.stringify(origDocs)).catch(() => 0)
    console.log('uncompressed input text', prettyBytes(JSON.stringify(origDocs).length))
    console.log('compressed input text', prettyBytes(sizeOrig), '(gzip)')

    const size = await gzipSize(searchEngine.hydrateState()).catch(() => 0)
    console.log('hydrated state size', prettyBytes(size), '(gzip)')

    // highest score for the article with title 'Information' as it's headline contains the search term
    const result = searchEngine.search('information')
    expect(result[0].metadata.title).toBe('Information')

    const result2 = searchEngine.search('programmée pour effectuer automatiquement')
    expect(result2[0].metadata.title).toBe('Ordinateur')

    const rehydratedEngine = SearchEngine.fromHydratedState(searchEngine.hydrateState(), language)

    // highest score for the article with title 'Information' as it's headline contains the search term
    expect(rehydratedEngine.search('information')[0].metadata.title).toBe('Information')

    // highest score for the article with title 'Communication' as it represents the best match
    expect(rehydratedEngine.search('programmée pour effectuer automatiquement')[0].metadata.title).toBe('Ordinateur')
  })

  test('should properly boost scores for documents with query terms in the title', () => {
    const searchEngine = new SearchEngine(
      {
        diacritics: language.diacritics,
        tokenizer: language.tokenizer,
        iso2Language: 'de',
        stopwords: [],
        stem: (word: string) => word,
      },
      [1, 1],
    )
    searchEngine.addDocument('Document de Test', { index_title: 'Titre de Test' })
    searchEngine.addDocument('Encore un Document-Test', { index_title: 'Titre sans rapport' })

    const scores = searchEngine.search('test')

    expect(scores[0].score).toBeGreaterThanOrEqual(scores[1].score)
    expect(scores[0].metadata.index_title).toBe('Titre de Test')
    expect(scores[1].metadata.index_title).toBe('Titre sans rapport')
  })
})
