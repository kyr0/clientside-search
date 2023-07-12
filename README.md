<h1 align="center">clientside-search</h1>

> "Why don't we have a decent client-side, in-browser search engine by now?" - Aron Homberg, 2023

This library provides Lucene-like full-text search features for the browser and Node.js.

This search engine uses several advanced algorithms to provide robust and efficient searching over a large collection of documents. The algorithms used include TF-IDF for weighing and ranking, BK-Tree for fuzzy matching, BM25 for relevance scoring, and Damerau-Levenshtein distance for measuring the edit distance between search terms. The search engine supports multiple languages and uses stemming and stopword removal to enhance its efficiency. It also supports the storage and retrieval of metadata associated with the documents. You can generate an index from a text corpus and metadata both on client- and server-side. You can hydrate and re-hydrate (reuse a pre-generated) index on both client- and server-side.

<h2 align="center">User Stories</h2>

1. I want to use a Lucene-like index that uses TF-IDF vectorization, BM25 and BKTree ranking as well as stemming and stopwords on client side.

2. I want to generate the search index either on client side or server-side (and re-hydrate/re-use it on client or server-side). State information should be small and compressed.

3. The full-text search shall be fast and efficient, not leading to alot of false-positives or false-negatives.

4. The search engine should be able to retreive and search in metadata that may be associated with each document.

5. The search engine should be able to remove/update it's index.

<h2 align="center">Features</h2>

- ✅ _Full-Text Search_: Provides the ability to perform a comprehensive text-based search over a large collection of documents.
- ✅ _Multilingual Support_: Supports multiple languages for indexing and searching documents.
- ✅ _Text Processing_: Includes text transformation operations like converting to lower case, splitting by words, stemming, and stopword removal.
- ✅ _Document Indexing_: Allows adding of documents to the index along with metadata to make them searchable.
  Document Removal: Provides functionality to remove a specific document from the index based on its ID.
- ✅ _Search Query Processing_: Processes search queries in the same way as document text to ensure a consistent matching algorithm.
- ✅ _Relevance Scoring with BM25 Algorithm_: Uses the BM25 algorithm for relevance scoring of documents against search queries.
- ✅ _Fuzzy Matching with BK-Tree_: Uses a BK-Tree structure to perform fuzzy matching, i.e., to find words in the index that are similar to the search terms.
- ✅ _Term Frequency-Inverse Document Frequency (TF-IDF) Weighting_: Uses TF-IDF to weight and rank the indexed words based on their importance in the document and rarity in the overall document set.
- ✅ _State Hydration and Dehydration_: Provides functionality to save (dehydrate) the state of the search engine to a compressed format, or to restore (hydrate) it from a previously saved state either locally or remotely.
  D- ✅ _Damerau-Levenshtein Distance Calculation_: Includes a function to calculate the Damerau-Levenshtein distance, i.e., the minimum number of operations (insertions, deletions, substitutions, transposition) required to change one word into another.
- ✅ _Document ID Generation_: Generates a unique ID for each document based on its text.
- ✅ _Automatic Stop Word selection_: Selects the best default stop words per language supported.
- ✅ Currently supports only: `en`, `de`
- ✅ Supports UTF8
- ✅ Available as a simple API
- ✅ Just `3.78 KiB` nano sized (ESM, gizpped)
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

const result = await clientsidesearch({
  foo: 'X',
})
```

<h3 align="center">CommonJS</h3>

```ts
const { clientsidesearch } = require('clientside-search')

// same API like ESM variant
```
