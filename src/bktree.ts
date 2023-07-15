import { DistanceCache, damerauLevenshteinDistance } from './engine'

export class BKTreeNode {
  word: string
  children: Map<number, BKTreeNode>
  count: number

  constructor(word: string, count: number = 1) {
    this.word = word
    this.children = new Map<number, BKTreeNode>()
    this.count = count
  }
}

export class BKTree {
  root: BKTreeNode | null
  distanceCache: DistanceCache

  constructor(distanceCache: DistanceCache) {
    this.root = null
    this.distanceCache = distanceCache
  }

  insert(word: string) {
    if (this.root === null) {
      this.root = new BKTreeNode(word)
    } else {
      this._insert(word, this.root)
    }
  }

  _insert(word: string, node: BKTreeNode) {
    const distance = damerauLevenshteinDistance(word, node.word, this.distanceCache)
    if (distance === 0) {
      node.count++
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
    const distance = damerauLevenshteinDistance(word, node.word, this.distanceCache)
    if (distance === 0) {
      node.count--
      if (node.count === 0) {
        if (node.children.size === 0) {
          return null
        } else {
          // keep the structure of the subtree
          const entries = Array.from(node.children.entries())
          const [, firstChild] = entries[0]
          const newRoot = firstChild
          for (let i = 1; i < entries.length; i++) {
            const [nextDistance, nextChild] = entries[i]
            newRoot.children.set(nextDistance, nextChild)
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
    const distance = damerauLevenshteinDistance(word, node.word, this.distanceCache)
    const lowerBound = distance - maxDistance
    const upperBound = distance + maxDistance

    if (distance <= maxDistance) {
      result.push({ word: node.word, distance })
    }

    node.children.forEach((childNode, childDistance) => {
      if (childDistance >= lowerBound && childDistance <= upperBound) {
        this._search(word, maxDistance, childNode, result)
      }
    })
  }
}
