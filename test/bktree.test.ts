import { BKTree } from '../dist/index.esm'

describe('BKTree and BKTreeNode', () => {
  let tree: BKTree

  beforeEach(() => {
    tree = new BKTree(new Map())
  })

  it('should correctly insert and search words', () => {
    tree.insert('test')
    tree.insert('toast')
    tree.insert('toast')
    tree.insert('roast')
    tree.insert('post')

    let result = tree.search('test', 2)

    expect(result).toEqual([
      { word: 'test', distance: 0 },
      { word: 'toast', distance: 2 },
      { word: 'post', distance: 2 },
    ])

    result = tree.search('toast', 1)

    expect(result).toEqual([
      { word: 'toast', distance: 0 },
      { word: 'roast', distance: 1 },
    ])
  })

  it('should correctly remove words', () => {
    tree.insert('test')
    tree.insert('toast')
    tree.insert('toast')
    tree.insert('roast')
    tree.insert('post')

    tree.remove('toast') // only removed one instance of 'toast'

    let result = tree.search('toast', 1)

    expect(result).toHaveLength(2)
    expect(result).toEqual([
      { word: 'toast', distance: 0 },
      { word: 'roast', distance: 1 },
    ])

    tree.remove('toast') // removed second instance of 'toast'

    let result2 = tree.search('toast', 1)

    expect(result2).toHaveLength(1)
    expect(result2).toEqual([{ distance: 1, word: 'roast' }]) // gone
  })

  it('should correctly serialize to JSON and restore from JSON', () => {
    tree.insert('test')
    tree.insert('toast')
    tree.insert('roast')
    tree.insert('post')

    const json = tree.toJSON()
    const restoredTree = BKTree.fromJSON(json, new Map())
    let result = restoredTree.search('test', 1)

    expect(result).toEqual([{ distance: 0, word: 'test' }])

    result = restoredTree.search('toast', 1)
    expect(result).toEqual([
      { distance: 0, word: 'toast' },
      { distance: 1, word: 'roast' },
    ])
  })
})
