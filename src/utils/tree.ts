import { HierachyNode } from '@antv/hierarchy'
import { TopicData } from '../types'
import { debug } from './debug'

function uuidv4() {
  return URL.createObjectURL(new Blob([])).slice(31)
}

export type HierachyNodeWithTopicData = HierachyNode<TopicData>
type UnionNode = HierachyNodeWithTopicData | TopicData

type ChildrenFn<T> = (node: T) => T[] | undefined

const defaultChildren = (node: HierachyNodeWithTopicData) => {
  return node.children
}

class TreeWalker<T extends UnionNode> {
  children: ChildrenFn<T>
  constructor(children: ChildrenFn<T>) {
    this.children = children
  }

  getNode(root: T, id: string): T | undefined {
    let target: T | undefined
    this.eachBefore(root, (node) => {
      if (node.id === id) target = node
    })
    return target
  }

  /**
   * Get node's descendants, exclude this node
   */
  getDescendants(root: T): T[] {
    const nodes: T[] = []
    this.eachBefore(root, (node) => {
      nodes.push(node)
    })
    return nodes.filter((node) => node !== root)
  }

  getParentNode(root: T, id: string): T | undefined {
    let target: T | undefined
    this.eachBefore(root, (node) => {
      if (!Array.isArray(this.children(node))) return
      if (this.children(node)?.some((item) => item.id === id)) target = node
    })
    return target
  }

  getPreviousNode(root: T, id: string): T | undefined {
    const parent = this.getParentNode(root, id)
    const children = this.children(parent!)
    if (parent && children) {
      const index = children.findIndex((node) => node.id === id)
      return children[index - 1]
    }

    return undefined
  }

  getNextNode(root: T, id: string): T | undefined {
    const parent = this.getParentNode(root, id)
    const children = this.children(parent!)
    if (parent && children) {
      const index = children.findIndex((node) => node.id === id)
      return children[index + 1]
    }

    return undefined
  }

  eachBefore(node: T, callback: (node: T) => void) {
    const nodes = [node]
    let children
    let i
    let current: T | undefined
    while ((current = nodes.pop())) {
      callback(current)
      children = this.children(current)
      if (children) {
        for (i = children.length - 1; i >= 0; --i) {
          nodes.push(children[i])
        }
      }
    }
  }
}

export const defaultWalker = new TreeWalker<HierachyNodeWithTopicData>(
  defaultChildren,
)
export const topicWalker = new TreeWalker<TopicData>((node) => node?.children)

function getDistance(
  a: HierachyNodeWithTopicData,
  b: HierachyNodeWithTopicData,
) {
  const xDiff = Math.abs(a.x - b.x)
  const yDiff = Math.abs(a.y - b.y)
  return Math.sqrt(xDiff ** 2 + yDiff ** 2)
}

function getClosedNode(
  array: HierachyNodeWithTopicData[],
  target: HierachyNodeWithTopicData,
): HierachyNodeWithTopicData | undefined {
  if (array.length === 0) return undefined
  return array.reduce<HierachyNodeWithTopicData | undefined>(
    (previous, curr) => {
      if (!previous) {
        previous = curr
      }

      return getDistance(target, curr) < getDistance(target, previous)
        ? curr
        : previous
    },
    undefined,
  )
}

export function getLeftNode(
  root: HierachyNodeWithTopicData,
  currentId: string,
) {
  if (root.id === currentId) {
    return getClosedNode(
      defaultWalker.getDescendants(root).filter((node) => node.x < root.x),
      root,
    )
  }

  const currentNode = defaultWalker.getNode(root, currentId)
  if (!currentNode) return
  const left =
    currentNode.side === 'right'
      ? defaultWalker.getParentNode(root, currentNode.id)
      : getClosedNode(defaultWalker.getDescendants(currentNode), currentNode)
  debug('getLeftNode', left)
  return left
}

export function getRighttNode(
  root: HierachyNodeWithTopicData,
  currentId: string,
) {
  if (root.id === currentId) {
    return getClosedNode(
      defaultWalker.getDescendants(root).filter((node) => node.x > root.x),
      root,
    )
  }

  const currentNode = defaultWalker.getNode(root, currentId)
  if (!currentNode) return
  const right =
    currentNode.side === 'right'
      ? getClosedNode(defaultWalker.getDescendants(currentNode), currentNode)
      : defaultWalker.getParentNode(root, currentNode.id)
  debug('getRighttNode', right)
  return right
}

export function getTopNode(root: HierachyNodeWithTopicData, currentId: string) {
  const array: HierachyNodeWithTopicData[] = []
  const currentNode = defaultWalker.getNode(root, currentId)
  if (!currentNode) return undefined
  defaultWalker.eachBefore(root, (node) => {
    if (node.y < currentNode.y) {
      array.push(node)
    }
  })
  return getClosedNode(array, currentNode)
}

export function getBottomNode(
  root: HierachyNodeWithTopicData,
  currentId: string,
) {
  const array: HierachyNodeWithTopicData[] = []
  const currentNode = defaultWalker.getNode(root, currentId)
  if (!currentNode) return undefined
  defaultWalker.eachBefore(root, (node) => {
    if (node.y > currentNode.y) {
      array.push(node)
    }
  })
  return getClosedNode(array, currentNode)
}

export function removeChild(parentNode: TopicData, id: string) {
  if (parentNode.children) {
    parentNode.children = parentNode.children.filter((item) => item.id !== id)
  }
}

export function createTopic(title: string, options: Partial<TopicData> = {}) {
  const topic: TopicData = {
    ...options,
    id: uuidv4(),
    title,
  }
  return topic
}

/**
 * Add side to TopicData, this will mutate TopicData and can be serialize to localStorage or database
 */
export function normalizeTopicSide(root: TopicData): TopicData {
  const { children } = root
  if (!children) return root
  if (children.length < 4) return root
  const mid = Math.ceil(children.length / 2)
  return {
    ...root,
    children: children.map((node, index) => {
      if (index < mid) {
        return {
          side: 'left',
          ...node,
        }
      }

      return node
    }),
  }
}

/**
 * Add depth to TopicData, this is used for local state, should not affect TopicData
 */
export function normalizeTopicDepth(root: TopicData, depth = 0): TopicData {
  return {
    ...root,
    depth,
    children: root.children?.map((node) =>
      normalizeTopicDepth(node, depth + 1),
    ),
    parent: undefined,
  }
}
