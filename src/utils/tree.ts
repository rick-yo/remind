import { hierarchy, HierarchyNode } from 'd3-hierarchy'
import { LayoutNode, TopicData } from '../types'
import { debug } from './debug'

function uuidv4() {
  return URL.createObjectURL(new Blob([])).slice(31)
}

function getDistance(a: LayoutNode, b: LayoutNode) {
  const xDiff = Math.abs(a.x - b.x)
  const yDiff = Math.abs(a.y - b.y)
  return Math.sqrt(xDiff ** 2 + yDiff ** 2)
}

export class LayoutTree {
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
    if (this.root.id === currentId) {
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
    debug('getLeftNode', left)
    return left
  }

  getRighttNode(currentId: string) {
    if (this.root.id === currentId) {
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
    debug('getRighttNode', right)
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

export class TopicTree {
  static from(root: TopicData) {
    return new TopicTree(root)
  }

  root: HierarchyNode<TopicData>
  constructor(root: TopicData) {
    this.root = hierarchy<TopicData>(root)
  }

  getNodeById(targetId: string) {
    return this.root.descendants().find((node) => node.data.id === targetId)
  }

  getParentNode(targetId: string) {
    return this.getNodeById(targetId)?.parent?.data
  }

  getPreviousNode(id: string) {
    const parent = this.getParentNode(id)
    const children = parent?.children
    if (parent && children) {
      const index = children.findIndex((node) => node.id === id)
      return children[index - 1]
    }

    return undefined
  }

  getNextNode(id: string) {
    const parent = this.getParentNode(id)
    const children = parent?.children
    if (parent && children) {
      const index = children.findIndex((node) => node.id === id)
      return children[index + 1]
    }

    return undefined
  }
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
