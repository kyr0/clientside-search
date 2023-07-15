import { SearchEngine } from '../dist/index.esm'
import language from '../dist/jp.esm'
import { readFileSync } from 'fs'
import { gzipSize } from 'gzip-size'
import prettyBytes from 'pretty-bytes'

// experimental
// TODO: implement and activate
const wikipediaArticles = JSON.parse(readFileSync('./wikipediaArticles_jp.json', 'utf8'))

describe('SearchEngine jp', () => {
  let searchEngine: SearchEngine

  beforeEach(() => {
    searchEngine = new SearchEngine(language)
    searchEngine.addDocument('急いで茶色のキツネが怠け者の犬の上を飛び越えます。', {
      id: 'taiken',
      debugStemmed: searchEngine.processText('急いで茶色のキツネが怠け者の犬の上を飛び越えます。').join(' '),
    })
    searchEngine.addDocument('急いで茶色のキツネがフェンスを飛び越えます。✅', {
      id: 'fence',
      debugStemmed: searchEngine.processText('急いで茶色のキツネがフェンスを飛び越えます。✅').join(' '),
    })
  })

  test('should create a new instance correctly', () => {
    expect(searchEngine).toBeInstanceOf(SearchEngine)
    expect(searchEngine.stopWords).toEqual(new Set(language.stopwords))
  })

  test('should correctly process text', () => {
    const processedText = searchEngine.processText('急いで茶色のキツネが怠け者の犬の上を飛び越えます。')

    console.log('processedText', processedText)

    const expectedText = ['急いで茶色のキツネが怠け者の犬の上を飛び越え']

    expect(processedText).toEqual(expectedText)
  })

  test('should match with phonetics when levensthein distance is similar', () => {
    const res = searchEngine.search('フェンス')
    expect(res[0].metadata.id).toEqual('fence')
  })

  test('should search for a query correctly', () => {
    const doc1 = 'これはテストドキュメントです。'
    const doc2 = 'このドキュメントではテストについて説明します。'
    const doc3 = 'これはテスト-ドキュメントです。'
    searchEngine.addDocument(doc1)
    const doc2Id = searchEngine.addDocument(doc2)
    const doc3Id = searchEngine.addDocument(doc3)

    const result = searchEngine.search('テスト')
    expect(result.length).toBeGreaterThanOrEqual(2)

    // adapt score based on your implementation
    expect(result[0]).toEqual({ id: doc2Id, score: 1.2252582925045064, metadata: {} })
    expect(result[1]).toEqual({ id: doc3Id, score: 0.8047083549318192, metadata: {} })
  })

  test('should remove a document correctly', () => {
    const doc = 'これはテストドキュメントです。'
    const docId3 = searchEngine.addDocument(doc)
    searchEngine.removeDocument(docId3)
    expect(searchEngine.documents[docId3]).toBeUndefined()

    const result = searchEngine.search('テスト')
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

    const result = hydratedEngine.search('フェンス')

    const result2 = hydratedEngine.search('✅')
    const result3 = hydratedEngine.search('✅')

    expect(result.length).toBe(2)
    expect(result[0].metadata.debugStemmed).toEqual('急 茶色 キツネ フェンス ✅')
    expect(result2.length).toBe(1)
    expect(result3.length).toBe(1)
  })

  test('add and search wikipedia articles', async () => {
    const origDocs: any = []

    wikipediaArticles.forEach((article: any) => {
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

    const result = searchEngine.search('情報')
    expect(result[0].metadata.title).toBe('情報')

    const result2 = searchEngine.search('コミュニケーションの正確な定義は')
    expect(result2[0].metadata.title).toBe('コミュニケーション')

    const rehydratedEngine = SearchEngine.fromHydratedState(searchEngine.hydrateState(), language)

    expect(rehydratedEngine.search('情報')[0].metadata.title).toBe('情報')

    expect(rehydratedEngine.search('コミュニケーションの正確な定義は')[0].metadata.title).toBe('コミュニケーション')
  })

  test('should properly boost scores for documents with query terms in the title', () => {
    const searchEngine = new SearchEngine({ iso2Language: 'jp', stopwords: [], stem: (word: string) => word }, [1, 1])
    searchEngine.addDocument('テストドキュメント', { index_title: 'テストタイトル' })
    searchEngine.addDocument('もう一つのテスト-ドキュメント', { index_title: '無関係なタイトル' })

    const scores = searchEngine.search('テスト')

    expect(scores[0].score).toBeGreaterThanOrEqual(scores[1].score)
    expect(scores[0].metadata.index_title).toBe('テストタイトル')
    expect(scores[1].metadata.index_title).toBe('無関係なタイトル')
  })
})
