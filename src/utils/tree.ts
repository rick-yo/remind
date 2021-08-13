import { TopicData } from 'xmind-model/types/models/topic'
import { HierachyNode } from '@antv/hierarchy'
import { ATTACHED_KEY } from '../constant'
import { debug } from './debug'

function uuidv4 () {
  return URL.createObjectURL(new Blob([])).substring(31)
}

export type HierachyNodeWithTopicData = HierachyNode<TopicData>
type UnionNode = HierachyNodeWithTopicData | TopicData

type ChildrenFn<T> = (node: T) => T[] | undefined

const defaultChildren = (node: HierachyNodeWithTopicData) => {
  return node.children
}

class TreeWalker<T extends UnionNode> {
  children: ChildrenFn<T>
  constructor (children: ChildrenFn<T>) {
    this.children = children
  }

  getNode (root: T, id: string): T | null {
    let target: T | null = null
    this.eachBefore(root, (node) => {
      if (node.id === id) target = node
    })
    return target
  }

  /**
   * get node's descendants, exclude this node
   */
  getDescendants (root: T): T[] {
    const nodes: T[] = []
    this.eachBefore(root, (node) => {
      nodes.push(node)
    })
    return nodes.filter((node) => node !== root)
  }

  getParentNode (root: T, id: string): T | undefined {
    let target: T | undefined
    this.eachBefore(root, (node) => {
      if (!Array.isArray(this.children(node))) return
      if (this.children(node)?.some((item) => item.id === id)) target = node
    })
    return target
  }

  getPreviousNode (root: T, id: string): T | undefined {
    const parent = this.getParentNode(root, id)
    const children = this.children(parent as T)
    if ((parent != null) && (children != null)) {
      const index = children.findIndex((node) => node.id === id)
      return children[index - 1]
    }
    return undefined
  }

  getNextNode (root: T, id: string): T | undefined {
    const parent = this.getParentNode(root, id)
    const children = this.children(parent as T)
    if ((parent != null) && (children != null)) {
      const index = children.findIndex((node) => node.id === id)
      return children[index + 1]
    }
    return undefined
  }

  eachBefore (node: T, callback: (node: T) => void) {
    const nodes = [node]
    let children
    let i
    // @ts-expect-error
    while (((node = nodes.pop()) != null)) {
      callback(node)
      children = this.children(node)
      if (children != null) {
        for (i = children.length - 1; i >= 0; --i) {
          nodes.push(children[i])
        }
      }
    }
  }
}

export const defaultWalker = new TreeWalker<HierachyNodeWithTopicData>(
  defaultChildren
)
export const topicWalker = new TreeWalker<TopicData>(
  (node) => node?.children?.attached
)

function getDistance (
  a: HierachyNodeWithTopicData,
  b: HierachyNodeWithTopicData
) {
  const xDiff = Math.abs(a.x - b.x)
  const yDiff = Math.abs(a.y - b.y)
  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
}

function getClosedNode (
  array: HierachyNodeWithTopicData[],
  target: HierachyNodeWithTopicData
): HierachyNodeWithTopicData | undefined {
  if (array.length === 0) return undefined
  return array.reduce<HierachyNodeWithTopicData | undefined>((prev, curr) => {
    if (prev == null) {
      prev = curr
    }
    return getDistance(target, curr) < getDistance(target, prev) ? curr : prev
  }, undefined)
}

export function getLeftNode (
  root: HierachyNodeWithTopicData,
  currentId: string
) {
  if (root.id === currentId) {
    return getClosedNode(
      defaultWalker.getDescendants(root).filter((node) => node.x < root.x),
      root
    )
  }
  const currentNode = defaultWalker.getNode(root, currentId)
  if (currentNode == null) return
  const left =
    currentNode.side === 'right'
      ? defaultWalker.getParentNode(root, currentNode.id)
      : getClosedNode(defaultWalker.getDescendants(currentNode), currentNode)
  debug('getLeftNode', left)
  return left
}

export function getRighttNode (
  root: HierachyNodeWithTopicData,
  currentId: string
) {
  if (root.id === currentId) {
    return getClosedNode(
      defaultWalker.getDescendants(root).filter((node) => node.x > root.x),
      root
    )
  }
  const currentNode = defaultWalker.getNode(root, currentId)
  if (currentNode == null) return
  const right =
    currentNode.side === 'right'
      ? getClosedNode(defaultWalker.getDescendants(currentNode), currentNode)
      : defaultWalker.getParentNode(root, currentNode.id)
  debug('getRighttNode', right)
  return right
}

export function getTopNode (root: HierachyNodeWithTopicData, currentId: string) {
  const array: HierachyNodeWithTopicData[] = []
  const currentNode = defaultWalker.getNode(root, currentId)
  if (currentNode == null) return undefined
  defaultWalker.eachBefore(root, (node) => {
    if (node.y < currentNode.y) {
      array.push(node)
    }
  })
  return getClosedNode(array, currentNode)
}

export function getBottomNode (
  root: HierachyNodeWithTopicData,
  currentId: string
) {
  const array: HierachyNodeWithTopicData[] = []
  const currentNode = defaultWalker.getNode(root, currentId)
  if (currentNode == null) return undefined
  defaultWalker.eachBefore(root, (node) => {
    if (node.y > currentNode.y) {
      array.push(node)
    }
  })
  return getClosedNode(array, currentNode)
}

export function removeChild (parentNode: TopicData, id: string) {
  if ((parentNode.children?.attached) != null) {
    parentNode.children.attached = parentNode.children.attached.filter(
      (item) => item.id !== id
    )
  }
}

export function createTopic (title: string, options: Partial<TopicData> = {}) {
  const topic: TopicData = {
    ...options,
    id: uuidv4(),
    title
  }
  return topic
}

/**
 * Add side to TopicData, this will mutate TopicData and can be serialize to localStorage or database
 */
export function normalizeTopicSide (root: TopicData) {
  if (!root?.children?.attached.length) return
  if (root.children.attached.length < 4) return
  const mid = Math.ceil(root.children.attached.length / 2)
  root.children[ATTACHED_KEY].slice(mid).forEach((node) => {
    node.side = node.side || 'left'
  })
}

/**
 * Add depth to TopicData, this is used for local state, should not affect TopicData
 */
export function normalizeTopicDepth (root: TopicData) {
  root.depth = 0
  const nodes = [root]
  while (nodes.length > 0) {
    const current = nodes.shift()
    current?.children?.attached.forEach((node) => {
      node.parent = current
      node.depth = (current.depth as number) + 1
      nodes.push(node)
    })
  }
  topicWalker.eachBefore(root, (node) => {
    delete node.parent
  })
}
