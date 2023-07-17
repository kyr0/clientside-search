<h1 align="center">clientside-search</h1>

> "Why don't we have a decent, Lucene-like client-side (in-browser) search engine by now?"

This library provides Lucene-like full-text search features for the browser and Node.js.

This search engine uses several advanced algorithms to provide robust and efficient searching over a large collection of documents. The algorithms used include TF-IDF for weighing and ranking, BK-Tree for fuzzy matching, BM25 for relevance scoring, and Damerau-Levenshtein distance for measuring the edit distance between search terms. The search engine supports multiple languages and uses stemming and stopword removal to enhance its efficiency. It also supports the storage and retrieval of metadata associated with the documents. You can generate an index from a text corpus and metadata both on client- and server-side. You can hydrate and re-hydrate (reuse a pre-generated) the index as well on both client- and server-side.

<h2 align="center">Developers' User Stories</h2>

1. I want to use a Lucene-like index that uses TF-IDF vectorization, BM25 and BKTree ranking as well as snowball stemming by and stopwords on client side.

2. I want to generate the search index either on client side or server-side (and re-hydrate/re-use it on client or server-side). State information should be small and compressed.

3. The full-text search shall be fast and efficient, not leading to alot of false-positives or false-negatives.

4. The search engine should be able to retreive and search in metadata that may be associated with each document.

5. The search engine should be able to remove/update it's index' documents.

6. State shall be hydratable.

<h2 align="center">Features</h2>

- ✅ _Full-Text Search_: Provides the ability to perform a comprehensive text-based search over a large collection of documents.
- ✅ _Multilingual Support_: Supports multiple languages for indexing and searching documents and automatic language detection for input text.
- ✅ _Text Processing_: Includes text transformation operations like converting to lower case, splitting by words, snowball stemming (Dr. Martin Porter), and stopword removal.
- ✅ _Document Indexing_: Allows adding of documents to the index along with metadata to make them searchable.
  Document Removal: Provides functionality to remove a specific document from the index based on its ID.
- ✅ _Search Query Processing_: Processes search queries in the same way as document text to ensure a consistent matching algorithm.
- ✅ _Relevance Scoring with BM25 Algorithm_: Uses the BM25 algorithm for relevance scoring of documents against search queries.
- ✅ _Fuzzy Matching with BK-Tree_: Uses a BK-Tree structure to perform fuzzy matching, i.e., to find words in the index that are similar to the search terms.
- ✅ _Term Frequency-Inverse Document Frequency (TF-IDF) Weighting_: Uses TF-IDF to weight and rank the indexed words based on their importance in the document and rarity in the overall document set.
- ✅ _State Hydration and Dehydration_: Provides functionality to save (dehydrate) the state of the search engine to a compressed format, or to restore (hydrate) it from a previously saved state either locally or remotely.
- ✅ _Damerau-Levenshtein Distance Calculation_: Includes a function to calculate the Damerau-Levenshtein distance, i.e., the minimum number of operations (insertions, deletions, substitutions, transposition) required to change one word into another.
- ✅ _Phonetic Scoring_: Uses language-specific phonetic algorithms such as Double Metaphone and Koelner Phonetik as a tie breaker when Damerau-Levenshtein Distance is equal for two matches.
- ✅ _Document ID Generation_: Generates a unique ID for each document based on its text.
- ✅ _Automatic Stop Word selection_: Selects the best default stop words per language supported.
- ✅ Currently supports only: `en`, `de`, `fr`, `es`, `ja`
- ✅ Supports UTF8
- ✅ Available as a simple API
- ✅ Just `8 KiB` nano sized (ESM, gizpped, base library)
- ✅ Zero dependencies!
- ✅ Tree-shakable and side-effect free
- ✅ First class TypeScript support
- ✅ Well tested using Jest Unit Tests

<h2 align="center">Example usage</h2>

<h3 align="center">Setup</h3>

- yarn: `yarn add clientside-search`
- npm: `npm install clientside-search`

<h3 align="center">ESM</h3>

```ts
import { SearchEngine } from 'clientside-search'
import en from 'clientside-search/en.esm'

// create a new instance of a search engine
const searchEngine = new SearchEngine(en)

// add some text
const docId1 = searchEngine.addDocument('The quick brown fox jumps over the lazy dog')

// you can also add UTF8 text, and metadata
const docId2 = searchEngine.addDocument('The quick brown fox jumps over the fence ✅', {
  // metadata with index_ prefix will be indexed for search
  index_title: 'Fence',
  date: new Date(),
  author: 'John Doe',
})

/**
 * {
 *   id:
 *   score: 1.34,
 *   metadata: { title: 'Fence', date: '2023-07-12 ...', author: 'John Doe' }
 * }
 */
const searchResult = searchEngine.search('Fence')

// if you want to persist the index state,
// hydratedState is a JSON string that you can persist
const hydratedState = searchEngine.hydrateState()

// PLEASE NOTE: The hydrated state does NOT contain the original input text
// It contains an optimized representation of the search index
// However, metadata is kept 1:1

// you can re-hydrate from that state anywhere,
// on the server or the client:
const hydratedEngine = SearchEngine.fromHydratedState(hydratedState, en)

// equals: searchResult
const searchResultFromHydated = hydratedEngine.search('Fence')
```

<h3 align="center">CommonJS</h3>

```ts
const { SearchEngine } = require('clientside-search')
const { en } = require('clientside-search/en.cjs')

// same API like ESM variant
```

<h3 align="center">Roadmap</h3>

- Advanced Asian language support:
  - Support for _Chinese_ using Jieba
    - No BKTree, but N-gram comparison
    - Character-based TF-IDF
    - Disable stemming
    - e.g. Jaccard similarity
  - Korean
    - No BKTree, but N-gram comparison
    - Jamo Levenshtein Distance
    - TF-IDF
