import { SearchEngine } from '../dist/index.esm'
import language from '../dist/en.esm'
import { readFileSync } from 'fs'
import { gzipSize } from 'gzip-size'
import prettyBytes from 'pretty-bytes'

const wikipediaArticles = JSON.parse(readFileSync('./wikipediaArticles.json', 'utf8'))

describe('SearchEngine en', () => {
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
    expect(result[0]).toEqual({
      id: searchEngine.generateId(doc1),
      match: 'exact',
      score: 1,
      metadata: {},
    })
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

    const rehydratedEngine = SearchEngine.fromHydratedState(searchEngine.hydrateState(), language)

    // highest score for the article with title 'Information' as it's headline contains the search term
    expect(rehydratedEngine.search('information')[0].metadata.title).toBe('Information')

    // highest score for the article with title 'Communication' as it represents the best match
    expect(rehydratedEngine.search('inquiry studying these transmissions')[0].metadata.title).toBe('Communication')
  })

  test('should match with phonetics when levensthein distance is similar', () => {
    const res = searchEngine.search('fenc')
    expect(res[0].metadata.id).toEqual('fence')

    const res2 = searchEngine.search('phence')
    expect(res2[0].metadata.id).toEqual('fence')
  })

  test('should properly boost scores for documents with query terms in the title', () => {
    const searchEngine = new SearchEngine(
      {
        diacritics: language.diacritics,
        tokenizer: language.tokenizer,
        iso2Language: 'en',
        stopwords: [],
        stem: (word: string) => word,
      },
      'distance',
      [1, 1],
    )
    searchEngine.addDocument('test document', { index_title: 'test title' })
    searchEngine.addDocument('another test document', { index_title: 'irrelevant title' })

    const scores = searchEngine.search('test')

    expect(scores[0].score).toBeGreaterThanOrEqual(scores[1].score)
    expect(scores[0].metadata.index_title).toBe('test title')
    expect(scores[1].metadata.index_title).toBe('irrelevant title')
  })

  test('should properly search and match technical text, such as @, $ etc. symbols', () => {
    const searchEngine = new SearchEngine(language, 'distance', [1, 1])
    searchEngine.addDocument('test document: $foo = 123;', { id: 'test' })
    searchEngine.addDocument('another test foo document @free', { id: 'test2' })

    const scores = searchEngine.search('$foo')

    expect(scores.length).toBe(2)
    expect(scores[0].metadata.id).toBe('test')
    expect(scores[1].metadata.id).toBe('test2')

    const scores2 = searchEngine.search('@fre')
    expect(scores2.length).toBe(1)
    expect(scores2[0].metadata.id).toBe('test2')
  })

  test('searching without stop words', () => {
    const data = [
      {
        id: '73B211DB-05CF-4025-B035-AD03454C47A6',
        baseIconId: '3AF49B97-A909-4961-9FBB-82C60D7CC773',
        name: 'arrow-up-drop-circle',
        codepoint: 'F0062',
        aliases: ['arrow-top-drop-circle'],
        styles: ['circle'],
        version: '1.5.54',
        deprecated: false,
        tags: ['Arrow'],
        author: 'Austin Andrews',
      },
      {
        id: '42277E7D-D87A-4DE9-982B-37E6A8AE4E70',
        baseIconId: '3AF49B97-A909-4961-9FBB-82C60D7CC773',
        name: 'arrow-up-drop-circle-outline',
        codepoint: 'F0063',
        aliases: ['arrow-top-drop-circle-outline'],
        styles: ['circle', 'outline'],
        version: '1.5.54',
        deprecated: false,
        tags: ['Arrow'],
        author: 'Austin Andrews',
      },
      {
        id: '7FBBA0AD-B8E1-4C13-8BD7-B37D28135DD2',
        baseIconId: '7FBBA0AD-B8E1-4C13-8BD7-B37D28135DD2',
        name: 'arrow-up-left',
        codepoint: 'F17BD',
        aliases: [],
        styles: [],
        version: '6.1.95',
        deprecated: false,
        tags: [],
        author: 'Colton Wiscombe',
      },
      {
        id: 'DDA1FF1D-BD25-4698-8D9B-7F0E6B71C274',
        baseIconId: '7FBBA0AD-B8E1-4C13-8BD7-B37D28135DD2',
        name: 'arrow-up-left-bold',
        codepoint: 'F17BE',
        aliases: [],
        styles: [],
        version: '6.1.95',
        deprecated: false,
        tags: [],
        author: 'Colton Wiscombe',
      },
      {
        id: '5C5BEA1F-BAA5-4F6A-AE84-F3EAD16C936C',
        baseIconId: '5C5BEA1F-BAA5-4F6A-AE84-F3EAD16C936C',
        name: 'arrow-up-right',
        codepoint: 'F17BF',
        aliases: [],
        styles: [],
        version: '6.1.95',
        deprecated: false,
        tags: [],
        author: 'Colton Wiscombe',
      },
      {
        id: '491E8E53-19DC-4736-AA7F-F95AEB0F1696',
        baseIconId: '5C5BEA1F-BAA5-4F6A-AE84-F3EAD16C936C',
        name: 'arrow-up-right-bold',
        codepoint: 'F17C0',
        aliases: [],
        styles: [],
        version: '6.1.95',
        deprecated: false,
        tags: [],
        author: 'Colton Wiscombe',
      },
      {
        id: '4EDBF232-461F-4F4C-82BB-64A89BA08405',
        baseIconId: '3AF49B97-A909-4961-9FBB-82C60D7CC773',
        name: 'arrow-up-thick',
        codepoint: 'F005E',
        aliases: ['arrow-top-thick', 'arrow-up-bold', 'arrow-top-bold'],
        styles: ['thick'],
        version: '1.5.54',
        deprecated: false,
        tags: ['Arrow'],
        author: 'Austin Andrews',
      },
      {
        id: '62E619DA-599C-486F-AD85-9B5BAB4F5A92',
        baseIconId: '3AF49B97-A909-4961-9FBB-82C60D7CC773',
        name: 'arrow-up-thin',
        codepoint: 'F19B2',
        aliases: [],
        styles: [],
        version: '6.5.95',
        deprecated: false,
        tags: ['Arrow'],
        author: 'Matt Stayner',
      },
      {
        id: '9733F983-7DD1-4230-B792-413D46E0B422',
        baseIconId: '3AF49B97-A909-4961-9FBB-82C60D7CC773',
        name: 'arrow-up-thin-circle-outline',
        codepoint: 'F1597',
        aliases: [],
        styles: [],
        version: '5.5.55',
        deprecated: false,
        tags: ['Arrow'],
        author: 'Google',
      },
      {
        id: '8B00DF03-0754-4D7F-B0C9-8CF21D42989F',
        baseIconId: 'DF1BCEA6-C202-477E-A3CF-2054D93E5F2A',
        name: 'arrow-vertical-lock',
        codepoint: 'F115C',
        aliases: ['scroll-vertical-lock'],
        styles: [],
        version: '4.4.95',
        deprecated: false,
        tags: ['Lock', 'Arrow'],
        author: 'Michael Irigoyen',
      },
      {
        id: '11D80B18-006C-4929-8CEA-29D2C8BED5B7',
        baseIconId: '11D80B18-006C-4929-8CEA-29D2C8BED5B7',
        name: 'artboard',
        codepoint: 'F1B9A',
        aliases: ['canvas', 'frame'],
        styles: [],
        version: '7.0.96',
        deprecated: false,
        tags: ['Drawing / Art'],
        author: 'Sintija',
      },
      {
        id: '548CCDA7-0E99-4568-9997-2ECFD33392BB',
        baseIconId: '548CCDA7-0E99-4568-9997-2ECFD33392BB',
        name: 'artstation',
        codepoint: 'F0B5B',
        aliases: [],
        styles: [],
        version: '3.0.39',
        deprecated: true,
        tags: ['Brand / Logo'],
        author: 'Contributors',
      },
      {
        id: 'AE294E7D-3AC0-4C7D-AFAF-8DDA0AB5BF52',
        baseIconId: 'AE294E7D-3AC0-4C7D-AFAF-8DDA0AB5BF52',
        name: 'aspect-ratio',
        codepoint: 'F0A24',
        aliases: [],
        styles: [],
        version: '2.6.95',
        deprecated: false,
        tags: [],
        author: 'Google',
      },
      {
        id: '0C612FE5-D7CC-44F3-945A-4BD15A7E39BA',
        baseIconId: '0C612FE5-D7CC-44F3-945A-4BD15A7E39BA',
        name: 'assistant',
        codepoint: 'F0064',
        aliases: [],
        styles: [],
        version: '1.5.54',
        deprecated: false,
        tags: [],
        author: 'Google',
      },
      {
        id: 'E8C373FE-4258-4341-B52A-E33D9A484968',
        baseIconId: 'E8C373FE-4258-4341-B52A-E33D9A484968',
        name: 'asterisk',
        codepoint: 'F06C4',
        aliases: ['required'],
        styles: [],
        version: '1.8.36',
        deprecated: false,
        tags: [],
        author: 'Michael Irigoyen',
      },
      {
        id: '1A9A6BE7-2B58-458C-9DA5-3CCA65D67414',
        baseIconId: 'E8C373FE-4258-4341-B52A-E33D9A484968',
        name: 'asterisk-circle-outline',
        codepoint: 'F1A27',
        aliases: ['required-circle'],
        styles: ['circle', 'outline'],
        version: '6.6.96',
        deprecated: false,
        tags: [],
        author: 'mocking-mike',
      },
      {
        id: '9FC24609-9C8B-4DBA-A473-F5EFAFCC90DF',
        baseIconId: '9FC24609-9C8B-4DBA-A473-F5EFAFCC90DF',
        name: 'at',
        codepoint: 'F0065',
        aliases: ['alternate-email'],
        styles: [],
        version: '1.5.54',
        deprecated: false,
        tags: [],
        author: 'Google',
      },
      {
        id: '18963ABD-E908-4E3C-B8DA-D87916F269F7',
        baseIconId: 'E76EC23F-AB71-49B3-9173-841544527A20',
        name: 'account-cowboy-hat',
        codepoint: 'F0E9B',
        aliases: ['rancher'],
        styles: ['variant'],
        version: '3.7.94',
        deprecated: false,
        tags: ['Account / User', 'Agriculture'],
        author: 'Augustin Ursu',
      },
      {
        id: 'E1C851E1-3BBD-4661-A6FA-C77AD370DC6A',
        baseIconId: 'E76EC23F-AB71-49B3-9173-841544527A20',
        name: 'account-cowboy-hat-outline',
        codepoint: 'F17F3',
        aliases: ['rancher-outline'],
        styles: ['outline', 'variant'],
        version: '6.1.95',
        deprecated: false,
        tags: ['Account / User', 'Agriculture'],
        author: 'Jeff Anders',
      },
      {
        id: '1D459B7E-A98C-4E02-929B-FA0BA329B97F',
        baseIconId: '1D459B7E-A98C-4E02-929B-FA0BA329B97F',
        name: 'cow',
        codepoint: 'F019A',
        aliases: ['emoji-cow', 'emoticon-cow'],
        styles: [],
        version: '1.5.54',
        deprecated: false,
        tags: ['Animal', 'Agriculture'],
        author: 'Austin Andrews',
      },
      {
        id: '8FA2AEE7-EBCA-4943-AF59-FF3C4D762C53',
        baseIconId: '1D459B7E-A98C-4E02-929B-FA0BA329B97F',
        name: 'cow-off',
        codepoint: 'F18FC',
        aliases: ['dairy-off', 'dairy-free'],
        styles: ['off'],
        version: '6.4.95',
        deprecated: false,
        tags: ['Food / Drink', 'Agriculture', 'Animal'],
        author: 'Michael Irigoyen',
      },
    ]

    const searchEngine = new SearchEngine({
      ...language,
      stopwords: [],
    })

    data.forEach((item) => {
      searchEngine.addDocument(
        `${item.name} ${item.aliases.join(' ')} ${item.tags.join(' ')}  ${item.styles.join(' ')}`,
        {
          index_title: item.name,
          id: item.id,
        },
      )
    })

    const scores = searchEngine.search('at')

    expect(scores.length).toBe(5)
    expect(scores[0].metadata.index_title).toBe('at')
    expect(scores[1].metadata.index_title).toBe('account-cowboy-hat-outline')

    const scores2 = searchEngine.search('cow')
    expect(scores2.length).toBe(7)
    expect(scores2[0].metadata.index_title).toBe('cow')
    expect(scores2[1].metadata.index_title).toBe('cow-off')
    expect(scores2[2].metadata.index_title).toBe('account-cowboy-hat-outline')
    expect(scores2[3].metadata.index_title).toBe('account-cowboy-hat')

    const scores3 = searchEngine.search('cowboys')
    expect(scores3.length).toBe(2)
    expect(scores3[0].metadata.index_title).toBe('account-cowboy-hat')
    expect(scores3[1].metadata.index_title).toBe('account-cowboy-hat-outline')

    const scores4 = searchEngine.search('boy')
    expect(scores4.length).toBe(9)
    expect(scores4[0].metadata.index_title).toBe('account-cowboy-hat-outline')
    expect(scores4[1].metadata.index_title).toBe('account-cowboy-hat')
  })

  test('huge list of icons to index, hydration', async () => {
    console.time('indexing position')
    const data = JSON.parse(readFileSync('./test/meta.json', 'utf8'))

    const searchEngine = new SearchEngine(
      {
        ...language,
        stopwords: [],
      },
      'position',
    )

    data.forEach((item) => {
      searchEngine.addDocument(
        `${item.name} ${item.aliases.join(' ')} ${item.tags.join(' ')}  ${item.styles.join(' ')}`,
        {
          index_title: item.name,
          id: item.id,
        },
      )
    })

    console.timeEnd('indexing position')

    const scores = searchEngine.search('at')

    expect(scores.length).toBe(27)
    expect(scores[0].metadata.index_title).toBe('at')

    const scores2 = searchEngine.search('cow')
    expect(searchEngine.processText('account-cowboy-hat-outline')).toEqual([
      'account',
      'cowboy',
      'hat',
      'outlin',
      'account-cowboy-hat-outlin',
    ])
    expect(scores2.length).toBe(4)
    expect(scores2[0].metadata.index_title).toBe('cow-off')
    expect(scores2[1].metadata.index_title).toBe('cow')
    expect(scores2[2].metadata.index_title).toBe('account-cowboy-hat-outline')
    expect(scores2[3].metadata.index_title).toBe('account-cowboy-hat')

    const scores3 = searchEngine.search('cowboys')
    expect(scores3.length).toBe(2)
    expect(scores3[0].metadata.index_title).toBe('account-cowboy-hat')
    expect(scores3[1].metadata.index_title).toBe('account-cowboy-hat-outline')

    const scores4 = searchEngine.search('boy')
    expect(scores4.length).toBe(3)
    expect(scores4[0].metadata.index_title).toBe('nintendo-game-boy')
    expect(scores4[1].metadata.index_title).toBe('human-male-boy')
    expect(scores4[2].metadata.index_title).toBe('human-female-boy')
    expect(scores4[3].metadata.index_title).toBe('account-cowboy-hat-outline')
    expect(scores4[4].metadata.index_title).toBe('account-cowboy-hat')

    const hydratedState = searchEngine.hydrateState()

    console.time('rehydrate position')
    const hydratedEngine = SearchEngine.fromHydratedState(hydratedState, {
      ...language,
      stopwords: [],
    })
    console.timeEnd('rehydrate position')

    expect(JSON.parse(hydratedState).iso2Language).toEqual(language.iso2Language)

    const size = await gzipSize(hydratedState).catch(() => 0)
    console.log('INDEX SIZE', prettyBytes(hydratedState.length))
    console.log('INDEX SIZE', prettyBytes(size), '(gzip)')

    const scoresH = hydratedEngine.search('at')

    expect(scoresH.length).toBe(577)
    expect(scoresH[0].metadata.index_title).toBe('at')

    const scores2H = hydratedEngine.search('cow')
    expect(hydratedEngine.processText('account-cowboy-hat-outline')).toEqual([
      'account',
      'cowboy',
      'hat',
      'outlin',
      'account-cowboy-hat-outlin',
    ])
    expect(scores2H.length).toBe(4)
    expect(scores2H[0].metadata.index_title).toBe('cow')
    expect(scores2H[1].metadata.index_title).toBe('cow-off')
    expect(scores2H[2].metadata.index_title).toBe('account-cowboy-hat')
    expect(scores2H[3].metadata.index_title).toBe('account-cowboy-hat-outline')

    const scores3H = hydratedEngine.search('cowboys')
    expect(scores3H.length).toBe(2)
    expect(scores3H[0].metadata.index_title).toBe('account-cowboy-hat')
    expect(scores3H[1].metadata.index_title).toBe('account-cowboy-hat-outline')

    const scores4H = hydratedEngine.search('boy')
    expect(scores4H.length).toBe(5)
    expect(scores4H[0].metadata.index_title).toBe('nintendo-game-boy')
    expect(scores4H[1].metadata.index_title).toBe('human-male-boy')
    expect(scores4H[2].metadata.index_title).toBe('human-female-boy')
    expect(scores4H[3].metadata.index_title).toBe('account-cowboy-hat')
    expect(scores4H[4].metadata.index_title).toBe('account-cowboy-hat-outline')

    const scoresAll = hydratedEngine.search('account')
    expect(scoresAll.length).toBe(186)

    const scores20 = hydratedEngine.search('account', 20)
    expect(scores20.length).toBe(20)
  })
})
