import { hierarchy, HierarchyNode } from 'd3-hierarchy'
import { TopicData } from '../interface/topic'
import { uuid } from './uuid'

export class TopicWalker {
  static from(root: TopicData) {
    return new TopicWalker(root)
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
  }

  getNextSibling(id: string) {
    const parent = this.getParentNode(id)
    const children = parent?.children
    if (parent && children) {
      const index = children.findIndex((node) => node.id === id)
      return children[index + 1]
    }
  }
}

export function createTopic(title: string, options: Partial<TopicData> = {}) {
  const topic: TopicData = {
    id: uuid(),
    title,
    ...options,
  }
  return topic
}

export function normalizeTopic(root: TopicData): TopicData {
  return normalizeTopicDepth(root)
}

/**
 * Add depth to TopicData, this is used for local state, should not affect TopicData
 */
function normalizeTopicDepth(root: TopicData, depth = 0): TopicData {
  if (!root) return root
  return {
    ...root,
    depth,
    children: root.children?.map((node) =>
      normalizeTopicDepth(node, depth + 1),
    ),
  }
}
