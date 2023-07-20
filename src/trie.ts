class TrieNode {
  children: { [key: string]: TrieNode }
  endOfWord: boolean

  constructor() {
    this.children = {}
    this.endOfWord = false
  }
}

export class Trie {
  root: TrieNode

  constructor() {
    this.root = new TrieNode()
  }

  insert(word: string) {
    this.insertSubstring(this.root, word)
    this.insertSubstring(this.root, word.split('').reverse().join(''))
  }

  private insertSubstring(root: TrieNode, substring: string) {
    let node = root
    for (let char of substring) {
      if (node.children[char] == null) {
        node.children[char] = new TrieNode()
      }
      node = node.children[char]
    }
    node.endOfWord = true
  }

  search(word: string): string[] {
    return [
      ...this.searchFromRoot(this.root, word),
      ...this.searchFromRoot(this.root, word.split('').reverse().join('')).map((w) => w.split('').reverse().join('')),
    ]
  }

  private searchFromRoot(node: TrieNode, word: string): string[] {
    for (let char of word) {
      node = node.children[char]
      if (node == null) return []
    }

    const matches: string[] = []
    this.collectAllWords(node, word, matches)
    return matches
  }

  delete(word: string): void {
    this.deleteRecursively(this.root, word, 0)
  }

  private deleteRecursively(node: TrieNode, word: string, index: number): boolean {
    if (index === word.length) {
      if (!node.endOfWord) return false
      node.endOfWord = false
      return Object.keys(node.children).length === 0
    }

    const char = word.charAt(index)
    const nextNode = node.children[char]
    if (nextNode == null) return false

    const shouldDeleteCurrentNode = this.deleteRecursively(nextNode, word, index + 1)

    if (shouldDeleteCurrentNode) {
      delete node.children[char]
      return Object.keys(node.children).length === 0
    }

    return false
  }

  private collectAllWords(node: TrieNode, prefix: string, collection: string[]) {
    if (node.endOfWord) {
      collection.push(prefix)
    }
    for (let char in node.children) {
      this.collectAllWords(node.children[char], prefix + char, collection)
    }
  }
}
