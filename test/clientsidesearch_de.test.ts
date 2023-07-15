import { SearchEngine } from '../dist/index.esm'
import language from '../dist/de.esm'
import { readFileSync } from 'fs'
import { gzipSize } from 'gzip-size'
import prettyBytes from 'pretty-bytes'
import { Iso2LanguageKey } from '../dist/language-detect.iife'

const wikipediaArticles = JSON.parse(readFileSync('./wikipediaArticles_de.json', 'utf8'))

describe('SearchEngine', () => {
  let searchEngine: SearchEngine

  beforeEach(() => {
    searchEngine = new SearchEngine(language) // use default stopwords and ngramRange
    searchEngine.addDocument('Der schnelle braune Fuchs springt über den faulen Hund.', {
      id: 'faul',
      debugStemmed: searchEngine.processText('Der schnelle braune Fuchs springt über den faulen Hund.').join(' '),
    })
    searchEngine.addDocument('Der schnelle braune Fuchs springt über den Zaun. ✅', {
      id: 'zaun',
      debugStemmed: searchEngine.processText('Der schnelle braune Fuchs springt über den Zaun. ✅').join(' '),
    })
  })

  test('should create a new instance correctly', () => {
    expect(searchEngine).toBeInstanceOf(SearchEngine)
    expect(searchEngine.stopWords).toEqual(new Set(language.stopwords))
  })

  test('should correctly process text', () => {
    const processedText = searchEngine.processText('Der schnelle braune Fuchs springt über den faulen Hund.')

    // Assuming stem_en stemming function turns "jumps" into "jump"
    // 'the' and 'over' have been removed as they are stop words
    const expectedText = ['schnell', 'braun', 'fuch', 'springt', 'faul', 'hund']

    expect(processedText).toEqual(expectedText)
  })

  test('should match with phonetics when levensthein distance is similar', () => {
    // possible matches for 'zaul' with levensthein distance 1
    // faul
    // zaun
    // both distances are 1, but 'zaun' should be the better match as it has the same phonetics
    // therefore koeln phonetics should be used as a tie breaker
    const res = searchEngine.search('zaul')
    expect(res[0].metadata.id).toEqual('zaun')
  })

  test('should search for a query correctly', () => {
    const doc1 = 'Das ist ein Testdokument.'
    const doc2 = 'In diesem Dokument gehts um Tests.'
    const doc3 = 'Das ist ein Test-Dokument.'
    searchEngine.addDocument(doc1)
    const doc2Id = searchEngine.addDocument(doc2)
    const doc3Id = searchEngine.addDocument(doc3)

    const result = searchEngine.search('Test')
    expect(result.length).toBeGreaterThanOrEqual(2)

    expect(result[0]).toEqual({ id: doc2Id, score: 1.2252582925045064, metadata: {} })
    expect(result[1]).toEqual({ id: doc3Id, score: 0.8047083549318192, metadata: {} })
  })

  test('should remove a document correctly', () => {
    const doc = 'Das ist ein Testdokument.'
    const docId3 = searchEngine.addDocument(doc)
    searchEngine.removeDocument(docId3)
    expect(searchEngine.documents[docId3]).toBeUndefined()

    const result = searchEngine.search('Test')
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

    const result = hydratedEngine.search('Zaun')

    // can it handle UTF8 characters?
    const result2 = hydratedEngine.search(' ✅')
    const result3 = hydratedEngine.search('✅')

    expect(result.length).toBe(2)
    expect(result[0].metadata.debugStemmed).toEqual('schnell braun fuch springt zaun ✅')
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

    // highest score for the article with title 'Communication' as it represents the best match
    const result2 = searchEngine.search('Die genaue Definition von Kommunikation ist')
    expect(result2[0].metadata.title).toBe('Kommunikation')

    const rehydratedEngine = SearchEngine.fromHydratedState(searchEngine.hydrateState(), language)

    // highest score for the article with title 'Information' as it's headline contains the search term
    expect(rehydratedEngine.search('information')[0].metadata.title).toBe('Information')

    // highest score for the article with title 'Communication' as it represents the best match
    expect(rehydratedEngine.search('Die genaue Definition von Kommunikation ist')[0].metadata.title).toBe(
      'Kommunikation',
    )
  })

  test('should properly boost scores for documents with query terms in the title', () => {
    const searchEngine = new SearchEngine({ iso2Language: 'de', stopwords: [], stem: (word: string) => word }, [1, 1])
    searchEngine.addDocument('Test Dokument', { index_title: 'Test Titel' })
    searchEngine.addDocument('Noch ein Test-Dokument', { index_title: 'Irrelevanter Titel' })

    const scores = searchEngine.search('test')

    expect(scores[0].score).toBeGreaterThanOrEqual(scores[1].score)
    expect(scores[0].metadata.index_title).toBe('Test Titel')
    expect(scores[1].metadata.index_title).toBe('Irrelevanter Titel')
  })
})
