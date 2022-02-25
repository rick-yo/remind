import { hierarchy, HierarchyNode } from 'd3-hierarchy'
import { TopicData } from '../types'

function uuidv4() {
  return URL.createObjectURL(new Blob([])).slice(31)
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

  getPreviousSibling(id: string) {
    const parent = this.getParentNode(id)
    const children = parent?.children
    if (parent && children) {
      const index = children.findIndex((node) => node.id === id)
      return children[index - 1]
    }

    return undefined
  }

  getNextSibling(id: string) {
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
