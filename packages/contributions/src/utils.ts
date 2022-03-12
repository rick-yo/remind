import { LayoutNode } from 'remind-core'

function getDistance(a: LayoutNode, b: LayoutNode) {
  const xDiff = Math.abs(a.x - b.x)
  const yDiff = Math.abs(a.y - b.y)
  return Math.sqrt(xDiff ** 2 + yDiff ** 2)
}

export class LayoutTreeWalker {
  static from(root: LayoutNode) {
    return new LayoutTreeWalker(root)
  }

  root: LayoutNode
  constructor(root: LayoutNode) {
    this.root = root
  }

  getNodeById(id: string) {
    return this.root.descendants().find((node) => node.data.id === id)
  }

  getParentNode(id: string) {
    const currentNode = this.getNodeById(id)
    if (!currentNode) return
    return currentNode?.parent
  }

  getNearestNode(nodes: LayoutNode[], id: string): LayoutNode | undefined {
    const target = this.getNodeById(id)
    let closed: LayoutNode = nodes[0]
    if (!target) return closed
    nodes.forEach((node) => {
      if (getDistance(target, node) < getDistance(target, closed)) {
        closed = node
      }
    })

    return closed
  }

  getNearestChildNode(id: string) {
    const currentNode = this.getNodeById(id)
    if (!currentNode) return
    const [, ...des] = currentNode.descendants()
    return this.getNearestNode(des, id)
  }

  getNearestTopNode(id: string) {
    const currentNode = this.getNodeById(id)
    if (!currentNode) return undefined
    const array = this.root
      .descendants()
      .filter((node) => node.y < currentNode.y)
    return this.getNearestNode(array, id)
  }

  getNearestBottomNode(id: string) {
    const currentNode = this.getNodeById(id)
    if (!currentNode) return undefined
    const array = this.root
      .descendants()
      .filter((node) => node.y > currentNode.y)
    return this.getNearestNode(array, id)
  }

  getNeighborNodes(id: string) {
    const currentNode = this.getNodeById(id)
    if (!currentNode) return []
    return this.root
      .descendants()
      .filter((node) => node.depth === currentNode?.depth)
  }

  getRightNeighborNode(id: string) {
    const currentNode = this.getNodeById(id)
    if (!currentNode) return
    const neighbors = this.getNeighborNodes(id).filter(
      (node) => node.x > currentNode.x,
    )
    return this.getNearestNode(neighbors, id)
  }

  getLeftNeighborNode(id: string) {
    const currentNode = this.getNodeById(id)
    if (!currentNode) return
    const neighbors = this.getNeighborNodes(id).filter(
      (node) => node.x < currentNode.x,
    )
    return this.getNearestNode(neighbors, id)
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

function hasOwn(obj: Object, key: PropertyKey) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

function createElement(tag: string, attrs?: Record<string, string>) {
  const el = document.createElement(tag)
  for (const name in attrs) {
    if (hasOwn(attrs, name)) {
      el.setAttribute(name, attrs[name])
    }
  }

  return el
}

export { KEY_MAPS, HOTKEYS, createElement }
