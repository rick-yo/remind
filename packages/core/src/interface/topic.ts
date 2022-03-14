import { HierarchyPointNode, HierarchyNode } from 'd3-hierarchy'

export interface TopicData {
  id: string
  title: string
  children?: TopicData[]
  /**
   * only set on root node's child node, to indicate layout direction
   * for horizontal layout tree, `start` place node to left side of parent node, `end` place node to right.
   */
  justify?: 'start' | 'end'
}

export type LayoutTopic = HierarchyPointNode<TopicData>
export type HierarchyTopic = HierarchyNode<TopicData>
