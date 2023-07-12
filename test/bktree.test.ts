import { BKTree } from '../dist/index.esm'

// Simple function for Damerau–Levenshtein distance.
// Replace with an actual implementation for real use.
const damerauLevenshteinDistance = (s1: string, s2: string) => Math.abs(s1.length - s2.length)

describe('BKTree and BKTreeNode', () => {
  let tree: BKTree

  beforeEach(() => {
    tree = new BKTree(damerauLevenshteinDistance)
  })

  it('should correctly insert and search words', () => {
    tree.insert('test')
    tree.insert('toast')
    tree.insert('toast')
    tree.insert('roast')
    tree.insert('post')

    let result = tree.search('test', 1)
    expect(result).toEqual([
      { distance: 0, word: 'test' },
      { distance: 1, word: 'toast' },
    ])

    result = tree.search('toast', 1)
    expect(result).toEqual([
      { distance: 1, word: 'test' },
      { distance: 0, word: 'toast' },
    ])
  })

  it('should correctly remove words', () => {
    tree.insert('test')
    tree.insert('toast')
    tree.insert('toast')
    tree.insert('roast')
    tree.insert('post')

    tree.remove('toast')

    let result = tree.search('toast', 1)
    expect(result).toHaveLength(2)
    expect(result).toEqual([
      { distance: 1, word: 'test' },
      { distance: 0, word: 'toast' },
    ])
  })

  it('should correctly serialize to JSON and restore from JSON', () => {
    tree.insert('test')
    tree.insert('toast')
    tree.insert('roast')
    tree.insert('post')

    const json = tree.toJSON()
    const restoredTree = BKTree.fromJSON(json, damerauLevenshteinDistance)

    let result = restoredTree.search('test', 1)
    expect(result).toEqual([
      { distance: 0, word: 'test' },
      { distance: 1, word: 'toast' },
    ])

    result = restoredTree.search('toast', 1)
    expect(result).toEqual([
      { distance: 1, word: 'test' },
      { distance: 0, word: 'toast' },
    ])
  })
})
