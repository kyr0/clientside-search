import { damerauLevenshteinDistance } from './engine'

export class BKTreeNode {
  word: string
  children: Map<number, BKTreeNode>
  count: number

  constructor(word: string, count: number = 1) {
    this.word = word
    this.children = new Map<number, BKTreeNode>()
    this.count = count
  }

  toJSON() {
    return {
      count: this.count,
      word: this.word,
      children: Array.from(this.children.entries()),
    }
  }

  static fromJSON(json: any) {
    const node = new BKTreeNode(json.word, json.count)
    json.children.forEach((value: [number, any]) => {
      if (Array.isArray(value) && value.length === 2) {
        const [key, child]: [number, any] = value
        node.children.set(key, BKTreeNode.fromJSON(child))
      }
    })
    return node
  }
}

export class BKTree {
  root: BKTreeNode | null

  constructor() {
    this.root = null
  }

  toJSON() {
    return {
      root: this.root ? this.root.toJSON() : null,
    }
  }

  static fromJSON(json: any) {
    const tree = new BKTree()
    tree.root = json.root ? BKTreeNode.fromJSON(json.root) : null
    return tree
  }

  insert(word: string) {
    if (this.root === null) {
      this.root = new BKTreeNode(word)
    } else {
      this._insert(word, this.root)
    }
  }

  _insert(word: string, node: BKTreeNode) {
    const distance = damerauLevenshteinDistance(word, node.word)
    if (distance === 0) {
      node.count++ // Increment count for the existing word
    } else if (!node.children.has(distance)) {
      node.children.set(distance, new BKTreeNode(word))
    } else {
      this._insert(word, node.children.get(distance) as BKTreeNode)
    }
  }
  remove(word: string) {
    if (this.root !== null) {
      this.root = this._remove(word, this.root)
    }
  }

  _remove(word: string, node: BKTreeNode): BKTreeNode | null {
    const distance = damerauLevenshteinDistance(word, node.word)
    if (distance === 0) {
      // Found the word
      node.count--
      if (node.count === 0) {
        // If count is 0, remove the node
        const children = Array.from(node.children.values())
        if (children.length === 0) {
          return null
        } else {
          let newRoot = children[0]
          for (let i = 1; i < children.length; i++) {
            this._insert(children[i].word, newRoot)
          }
          return newRoot
        }
      }
    } else {
      const child = node.children.get(distance)
      if (child) {
        const newChild = this._remove(word, child)
        if (newChild === null) {
          node.children.delete(distance)
        } else {
          node.children.set(distance, newChild)
        }
      }
    }
    return node.count > 0 ? node : null
  }

  search(word: string, maxDistance: number) {
    if (this.root === null) {
      return []
    } else {
      const result: { word: string; distance: number }[] = []
      this._search(word, maxDistance, this.root, result)
      return result
    }
  }

  _search(word: string, maxDistance: number, node: BKTreeNode, result: { word: string; distance: number }[]) {
    const distance = damerauLevenshteinDistance(word, node.word)
    if (distance <= maxDistance) {
      result.push({ word: node.word, distance })
    }
    node.children.forEach((childNode, childDistance) => {
      if (childDistance >= distance - maxDistance && childDistance <= distance + maxDistance) {
        this._search(word, maxDistance, childNode, result)
      }
    })
  }
}
