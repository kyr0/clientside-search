import { SearchEngine } from '../dist/index.esm'
import language from '../dist/ja.esm'
import { readFileSync } from 'fs'
import { gzipSize } from 'gzip-size'
import prettyBytes from 'pretty-bytes'

const wikipediaArticles = JSON.parse(readFileSync('./wikipediaArticles_ja.json', 'utf8'))

describe('SearchEngine ja', () => {
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

  test('should tokenize correctly', () => {
    const tok1 = searchEngine.processText('情報とは何かという問いに、ただひとつの答えを与えることは困難である[2]。')

    expect(tok1).toEqual([
      '報',
      '情報',
      '報と',
      'とは',
      'は何',
      '何か',
      'かと',
      'とい',
      'いう',
      'う問',
      '問い',
      'いに',
      'に、',
      '、た',
      'ただ',
      'だひ',
      'ひと',
      'とつ',
      'つの',
      'の答',
      '答え',
      'えを',
      'を与',
      '与え',
      'える',
      'るこ',
      'こと',
      'とは',
      'は困',
      '困難',
      '難で',
      'であ',
      'ある',
      'る[',
      '[2',
      '2]',
      ']。',
      '情報と',
      '報とは',
      'とは何',
      'は何か',
      '何かと',
      'かとい',
      'という',
      'いう問',
      'う問い',
      '問いに',
      'いに、',
      'に、た',
      '、ただ',
      'ただひ',
      'だひと',
      'ひとつ',
      'とつの',
      'つの答',
      'の答え',
      '答えを',
      'えを与',
      'を与え',
      '与える',
      'えるこ',
      'ること',
      'ことは',
      'とは困',
      'は困難',
      '困難で',
      '難であ',
      'である',
      'ある[',
      'る[2',
      '[2]',
      '2]。',
    ])
  })

  test('should create a new instance correctly', () => {
    expect(searchEngine).toBeInstanceOf(SearchEngine)
    expect(searchEngine.stopWords).toEqual(new Set(language.stopwords))
  })

  test('should correctly process text', () => {
    const processedText = searchEngine.processText('急いで茶色のキツネが怠け者の犬の上を飛び越えます。')

    const expectedText = [
      '茶',
      '者',
      '犬',
      '急い',
      'いで',
      'で茶',
      '茶色',
      '色の',
      'のキ',
      'キツ',
      'ツネ',
      'ネが',
      'が怠',
      '怠け',
      'け者',
      '者の',
      'の犬',
      '犬の',
      'の上',
      '上を',
      'を飛',
      '飛び',
      'び越',
      '越え',
      'えま',
      'ます',
      'す。',
      '急いで',
      'いで茶',
      'で茶色',
      '茶色の',
      '色のキ',
      'のキツ',
      'キツネ',
      'ツネが',
      'ネが怠',
      'が怠け',
      '怠け者',
      'け者の',
      '者の犬',
      'の犬の',
      '犬の上',
      'の上を',
      '上を飛',
      'を飛び',
      '飛び越',
      'び越え',
      '越えま',
      'えます',
      'ます。',
    ]

    expect(processedText).toEqual(expectedText)
  })

  test('should search for a query correctly', () => {
    const doc1 = 'これはテストドキュメントです。'
    const doc11 = 'これは-ドキュメントです。'
    const doc2 = 'このドキュメントではテストについて説明します。'
    const doc3 = 'これはテスト-ドキュメントです。'
    const doc1Id = searchEngine.addDocument(doc1, { a: 1 })
    const doc11Id = searchEngine.addDocument(doc11, { a: 11 })
    const doc2Id = searchEngine.addDocument(doc2, { b: 2 })
    const doc3Id = searchEngine.addDocument(doc3, { c: 3 })

    const result = searchEngine.search('テスト')
    expect(result.length).toEqual(3)

    // adapt score based on your implementation
    expect(result[0]).toEqual({ id: doc1Id, score: 0.8999999999999999, metadata: { a: 1 } })
    expect(result[1]).toEqual({ id: doc2Id, score: 0.8999999999999999, metadata: { b: 2 } })
    expect(result[2]).toEqual({ id: doc3Id, score: 0.8999999999999999, metadata: { c: 3 } })
  })

  test('should search for a longer query that partially matches, with lower score correctly', () => {
    const doc1 = 'これはテストドキュメントです。'
    const doc11 = 'これは-ドキュメントです。'
    const doc2 = 'このドキュメントではテストについて説明します。'
    const doc3 = 'これはテスト-ドキュメントです。'
    const doc1Id = searchEngine.addDocument(doc1, { a: 1 })
    const doc11Id = searchEngine.addDocument(doc11, { a: 11 })
    const doc2Id = searchEngine.addDocument(doc2, { b: 2 })
    const doc3Id = searchEngine.addDocument(doc3, { c: 3 })

    const result = searchEngine.search('ではテスト')
    expect(result.length).toEqual(3)

    // adapt score based on your implementation
    expect(result[0]).toEqual({ id: doc2Id, score: 4.96738313739092, metadata: { b: 2 } })
    expect(result[1]).toEqual({ id: doc1Id, score: 1.5, metadata: { a: 1 } })
    expect(result[2]).toEqual({ id: doc3Id, score: 1.5, metadata: { c: 3 } })
  })

  test('should remove a document correctly', () => {
    const doc = 'これはテストドキュメントです。'
    const docId3 = searchEngine.addDocument(doc)
    searchEngine.removeDocument(docId3)
    expect(searchEngine.documents[docId3]).toBeUndefined()

    const result = searchEngine.search('トドキュ')
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

    const result = hydratedEngine.search('スを飛び')
    const result2 = hydratedEngine.search('。✅')
    const result3 = hydratedEngine.search('✅')

    expect(result.length).toBe(2)
    expect(result[0].metadata.debugStemmed).toEqual(
      '茶 急い いで で茶 茶色 色の のキ キツ ツネ ネが がフ フェ ェン ンス スを を飛 飛び び越 越え えま ます す。 。✅ 急いで いで茶 で茶色 茶色の 色のキ のキツ キツネ ツネが ネがフ がフェ フェン ェンス ンスを スを飛 を飛び 飛び越 び越え 越えま えます ます。 す。✅',
    )
    expect(result2.length).toBe(1)
    expect(result3.length).toBe(0) // there is no 1-gram search
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

    const result = searchEngine.search('ベルで、')
    expect(result[0].metadata.title).toBe('情報')

    const result2 = searchEngine.search('は情報を伝')
    expect(result2[0].metadata.title).toBe('データ')

    const rehydratedEngine = SearchEngine.fromHydratedState(searchEngine.hydrateState(), language)

    expect(rehydratedEngine.search('ベルで、')[0].metadata.title).toBe('情報')

    expect(rehydratedEngine.search('は情報を伝')[0].metadata.title).toBe('データ')
  })

  test('should properly boost scores for documents with query terms in the title', () => {
    const searchEngine = new SearchEngine(language)
    searchEngine.addDocument('テストドキュメント', { index_title: 'テストタイトル' })
    searchEngine.addDocument('もう一つのテスト-ドキュメント', { index_title: '無関係なタイトル' })

    const scores = searchEngine.search('テスト')

    expect(scores[0].score).toBeGreaterThanOrEqual(scores[1].score)
    expect(scores[0].metadata.index_title).toBe('テストタイトル')
    expect(scores[1].metadata.index_title).toBe('無関係なタイトル')
  })
})
