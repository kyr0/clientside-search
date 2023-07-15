import { SearchEngine } from '../dist/index.esm'
import language from '../dist/en.esm'
import { readFileSync } from 'fs'
import { gzipSize } from 'gzip-size'
import prettyBytes from 'pretty-bytes'

const wikipediaArticles = JSON.parse(readFileSync('./wikipediaArticles.json', 'utf8'))

describe('SearchEngine', () => {
  let searchEngine: SearchEngine

  beforeEach(() => {
    searchEngine = new SearchEngine(language) // use default stopwords and ngramRange
    searchEngine.addDocument('The quick brown fox jumps over the lazy dog', {
      id: 'lazy',
    })
    searchEngine.addDocument('The quick brown fox jumps over the fence ✅', {
      id: 'fence',
    })
  })

  test('should create a new instance correctly', () => {
    expect(searchEngine).toBeInstanceOf(SearchEngine)
    expect(searchEngine.stopWords).toEqual(new Set(language.stopwords))
  })

  test('should correctly process text', () => {
    const processedText = searchEngine.processText('The quick brown fox jumps over the lazy dog')

    // Assuming stem_en stemming function turns "jumps" into "jump"
    // 'the' and 'over' have been removed as they are stop words
    const expectedText = ['quick', 'brown', 'fox', 'jump', 'lazi', 'dog']

    expect(processedText).toEqual(expectedText)
  })

  test('should search for a query correctly', () => {
    const doc1 = 'This is a test document.'
    const doc2 = 'This document is about tests.'
    searchEngine.addDocument(doc1)
    searchEngine.addDocument(doc2)

    const result = searchEngine.search('test')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0]).toEqual({ id: searchEngine.generateId(doc1), score: 0.3, metadata: {} })
  })

  test('should remove a document correctly', () => {
    const doc = 'This is a test document.'
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

    const result = hydratedEngine.search('fence')
    // can it handle UTF8 characters?
    const result2 = hydratedEngine.search(' ✅')
    const result3 = hydratedEngine.search('✅')
    expect(result.length).toBe(1)
    expect(result2.length).toBe(1)
    expect(result3.length).toBe(1)
  })

  test('add and search wikipedia articles', () => {
    wikipediaArticles.forEach((article: any) => {
      /** e.g.: article == {
        term: 'information',
        text: 'Information is an abstract concept that refers to that which has the power to inform. At the most fundamental level, information pertains to the interpretation of that which may be sensed, or their abstractions. Any natural process that is not completely random and any observable pattern in any medium can be said to convey some amount of information. Whereas digital signals and other data use discrete signs to convey information, other phenomena and artefacts such as analogue signals, poems, pictures, music or other sounds, and currents convey information in a more continuous form. Information is not knowledge itself, but the meaning that may be derived from a representation through interpretation.',
        metadata: { id: 'Q11028', index_title: 'Information', lang: 'en' }
      }, */
      searchEngine.addDocument(article.text, article.metadata)
    })

    // highest score for the article with title 'Information' as it's headline contains the search term
    const result = searchEngine.search('information')
    expect(result[0].metadata.title).toBe('Information')

    // highest score for the article with title 'Communication' as it represents the best match
    const result2 = searchEngine.search('inquiry studying these transmissions')
    expect(result2[0].metadata.title).toBe('Communication')
  })

  test('should match with phonetics when levensthein distance is similar', () => {
    const res = searchEngine.search('fenc')
    expect(res[0].metadata.id).toEqual('fence')

    const res2 = searchEngine.search('phence')
    expect(res2[0].metadata.id).toEqual('fence')
  })

  test('should properly boost scores for documents with query terms in the title', () => {
    const searchEngine = new SearchEngine({ iso2Language: 'en', stopwords: [], stem: (word: string) => word }, [1, 1])
    searchEngine.addDocument('test document', { index_title: 'test title' })
    searchEngine.addDocument('another test document', { index_title: 'irrelevant title' })

    const scores = searchEngine.search('test')

    expect(scores[0].score).toBeGreaterThanOrEqual(scores[1].score)
    expect(scores[0].metadata.index_title).toBe('test title')
    expect(scores[1].metadata.index_title).toBe('irrelevant title')
  })
})
