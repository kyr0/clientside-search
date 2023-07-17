import { SearchEngine } from '../dist/index.esm'
import language from '../dist/es.esm'
import { readFileSync } from 'fs'
import { gzipSize } from 'gzip-size'
import prettyBytes from 'pretty-bytes'

const wikipediaArticles = JSON.parse(readFileSync('./wikipediaArticles_es.json', 'utf8'))

describe('SearchEngine es', () => {
  let searchEngine: SearchEngine

  beforeEach(() => {
    searchEngine = new SearchEngine(language) // usar palabras vacías y rango de ngramas predeterminado
    searchEngine.addDocument('El rápido zorro marrón salta sobre el perro perezoso.', {
      id: 'perezoso',
      debugStemmed: searchEngine.processText('El rápido zorro marrón salta sobre el perro perezoso.').join(' '),
    })
    searchEngine.addDocument('El rápido zorro marrón salta sobre la valla. ✅', {
      id: 'valla',
      debugStemmed: searchEngine.processText('El rápido zorro marrón salta sobre la valla. ✅').join(' '),
    })
  })

  test('debería crear una nueva instancia correctamente', () => {
    expect(searchEngine).toBeInstanceOf(SearchEngine)
    expect(searchEngine.stopWords).toEqual(new Set(language.stopwords))
  })

  test('debería procesar el texto correctamente', () => {
    const processedText = searchEngine.processText('El rápido zorro marrón salta sobre el perro perezoso.')

    // Suponiendo que la función de stemming convierte "salta" a "salt"
    // 'El' y 'sobre' han sido eliminados por ser palabras vacías
    const expectedText = ['rap', 'zorr', 'marron', 'salt', 'sobr', 'perr', 'perez']

    expect(processedText).toEqual(expectedText)
  })

  test('debería coincidir con fonéticos cuando la distancia de Levenshtein es similar', () => {
    const res = searchEngine.search('perezozo')
    expect(res[0].metadata.id).toEqual('perezoso')
  })

  test('debería buscar una consulta correctamente', () => {
    const doc1 = 'Este es un documento de prueba.'
    const doc2 = 'Este documento es sobre pruebas.'
    const doc3 = 'Este es un documento-prueba.'
    searchEngine.addDocument(doc1, { stemmed: searchEngine.processText(doc1) })
    searchEngine.addDocument(doc2, { stemmed: searchEngine.processText(doc2) })
    searchEngine.addDocument(doc3, { stemmed: searchEngine.processText(doc3) })

    const result = searchEngine.search('sobre')
    expect(result.length).toBeGreaterThanOrEqual(1)

    expect(result[0].metadata.debugStemmed.split(' ')[4]).toEqual('sobr')
  })

  test('debería eliminar un documento correctamente', () => {
    const doc = 'Este es un documento de prueba.'
    const docId3 = searchEngine.addDocument(doc)
    searchEngine.removeDocument(docId3)
    expect(searchEngine.documents[docId3]).toBeUndefined()

    const result = searchEngine.search('prueba')
    expect(result.length).toBe(0)
  })

  test('debería serializar y deserializar correctamente utilizando hydrateState y fromHydratedState', async () => {
    const hydratedState = searchEngine.hydrateState()

    expect(JSON.parse(hydratedState).iso2Language).toEqual(language.iso2Language)

    const size = await gzipSize(hydratedState).catch(() => 0)
    console.log('TAMAÑO DEL ÍNDICE', prettyBytes(size), '(gzip)')

    const hydratedEngine = SearchEngine.fromHydratedState(hydratedState, language)

    expect(hydratedEngine).toBeInstanceOf(SearchEngine)
    expect(hydratedEngine.stemmedDocuments).toEqual(searchEngine.stemmedDocuments)
    expect(hydratedEngine.ngramRange).toEqual(searchEngine.ngramRange)

    const result = hydratedEngine.search('valla')

    // ¿puede manejar caracteres UTF8?
    const result2 = hydratedEngine.search(' ✅')
    const result3 = hydratedEngine.search('✅')

    expect(result.length).toBe(2)
    expect(result[0].metadata.debugStemmed).toEqual('rap zorr marron salt sobr vall ✅')
    expect(result2.length).toBe(1)
    expect(result3.length).toBe(1)
  })

  test('agregar y buscar artículos de Wikipedia', async () => {
    const origDocs: any = []

    wikipediaArticles.forEach((article: any) => {
      searchEngine.addDocument(article.text, article.metadata)

      origDocs.push({
        text: article.text,
        metadata: article.metadata,
      })
    })

    const sizeOrig = await gzipSize(JSON.stringify(origDocs)).catch(() => 0)
    console.log('texto de entrada sin comprimir', prettyBytes(JSON.stringify(origDocs).length))
    console.log('texto de entrada comprimido', prettyBytes(sizeOrig), '(gzip)')

    const size = await gzipSize(searchEngine.hydrateState()).catch(() => 0)
    console.log('tamaño del estado hidratado', prettyBytes(size), '(gzip)')

    // la puntuación más alta para el artículo con el título 'Información' ya que su titular contiene el término de búsqueda
    const result = searchEngine.search('información')
    expect(result[0].metadata.title).toBe('Información')

    const result2 = searchEngine.search('programado para realizar automáticamente')
    expect(result2[0].metadata.title).toBe('Computadora')

    const rehydratedEngine = SearchEngine.fromHydratedState(searchEngine.hydrateState(), language)

    // la puntuación más alta para el artículo con el título 'Información' ya que su titular contiene el término de búsqueda
    expect(rehydratedEngine.search('información')[0].metadata.title).toBe('Información')

    // la puntuación más alta para el artículo con el título 'Computadora' ya que representa la mejor coincidencia
    expect(rehydratedEngine.search('programado para realizar automáticamente')[0].metadata.title).toBe('Computadora')
  })

  test('debería ponderar adecuadamente las puntuaciones para los documentos con términos de búsqueda más frecuentes', () => {
    const searchEngine = new SearchEngine(
      {
        diacritics: language.diacritics,
        tokenizer: language.tokenizer,
        iso2Language: 'es',
        stopwords: [],
        stem: (word: string) => word,
      },
      [1, 1],
    )
    searchEngine.addDocument('Este es un documento de prueba. Prueba de búsqueda.')
    searchEngine.addDocument('Este es otro documento de prueba.')

    const scores = searchEngine.search('prueba')

    // Dado que el primer documento contiene el término de búsqueda "prueba" dos veces,
    // debería tener una puntuación mayor que el segundo documento que solo contiene el término una vez.
    expect(scores[0].score).toBeGreaterThanOrEqual(scores[1].score)
  })
})
