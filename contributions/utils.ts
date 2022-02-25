import { LayoutNode } from '../src/types'

function getDistance(a: LayoutNode, b: LayoutNode) {
  const xDiff = Math.abs(a.x - b.x)
  const yDiff = Math.abs(a.y - b.y)
  return Math.sqrt(xDiff ** 2 + yDiff ** 2)
}

class LayoutTree {
  static from(root: LayoutNode) {
    return new LayoutTree(root)
  }

  root: LayoutNode
  constructor(root: LayoutNode) {
    this.root = root
  }

  getNodeById(targetId: string) {
    return this.root.descendants().find((node) => node.data.id === targetId)
  }

  getClosedNode(
    array: LayoutNode[],
    target: LayoutNode,
  ): LayoutNode | undefined {
    if (array.length === 0) return undefined
    return array.reduce<LayoutNode | undefined>((previous, curr) => {
      if (!previous) {
        previous = curr
      }

      return getDistance(target, curr) < getDistance(target, previous)
        ? curr
        : previous
    }, undefined)
  }

  getLeftNode(currentId: string) {
    if (this.root.data.id === currentId) {
      return this.getClosedNode(
        this.root.descendants().filter((node) => node.x < this.root.x),
        this.root,
      )
    }

    const currentNode = this.getNodeById(currentId)
    if (!currentNode) return
    const left =
      currentNode.data.side === 'right'
        ? this.getNodeById(currentNode.data.id)?.parent
        : this.getClosedNode(currentNode.descendants(), currentNode)
    return left
  }

  getRighttNode(currentId: string) {
    if (this.root.data.id === currentId) {
      return this.getClosedNode(
        this.root.descendants().filter((node) => node.x > this.root.x),
        this.root,
      )
    }

    const currentNode = this.getNodeById(currentId)
    if (!currentNode) return
    const right =
      currentNode.data.side === 'right'
        ? this.getClosedNode(currentNode.descendants(), currentNode)
        : this.getNodeById(currentNode.data.id)?.parent
    return right
  }

  getTopNode(currentId: string) {
    const array: LayoutNode[] = []
    const currentNode = this.getNodeById(currentId)
    if (!currentNode) return undefined
    this.root.eachBefore((node) => {
      if (node.y < currentNode.y) {
        array.push(node)
      }
    })
    return this.getClosedNode(array, currentNode)
  }

  getBottomNode(currentId: string) {
    const array: LayoutNode[] = []
    const currentNode = this.getNodeById(currentId)
    if (!currentNode) return undefined
    this.root.eachBefore((node) => {
      if (node.y > currentNode.y) {
        array.push(node)
      }
    })
    return this.getClosedNode(array, currentNode)
  }
}

function selectText(element?: HTMLElement) {
  if (!element) return
  if (window.getSelection && document.createRange) {
    const selection = window.getSelection()
    if (selection?.toString() === '') {
      // No text selection
      setTimeout(function () {
        const range = document.createRange() // Range object
        range.selectNodeContents(element) // Sets Range
        selection.removeAllRanges() // Remove all ranges from selection
        selection.addRange(range) // Add Range to a Selection.
      }, 1)
    }
  }
}

const KEY_MAPS: Record<string, string> = {
  Backspace: 'Backspace',
  Tab: 'Tab',
  Enter: 'Enter',
  Escape: 'Escape',
  Space: 'Space',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
}

const HOTKEYS = {
  tab: 'tab',
  space: 'space',
  backspace: 'backspace',
  left: 'left',
  right: 'right',
  up: 'up,top',
  down: 'down',
  undo: 'command+z,ctrl+z',
  redo: 'command+shift+z,ctrl+shift+z',
}

function createElement(tag: string, attrs?: Record<string, string>) {
  const el = document.createElement(tag)
  for (const name in attrs) {
    if (Object.prototype.hasOwnProperty.call(attrs, name)) {
      el.setAttribute(name, attrs[name])
    }
  }

  return el
}

export { selectText, LayoutTree, KEY_MAPS, HOTKEYS, createElement }
