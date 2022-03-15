import { HierarchyPointNode, HierarchyNode } from 'd3-hierarchy'

export interface TopicData {
  id: string
  /**
   * topic text content
   */
  title: string
  children?: TopicData[]
  /**
   * control layout direction, should only set on root node's child node
   * for horizontal layout tree, `start` place node to left side of parent node, `end` place node to right.
   * `justify` is only supported in `mindmap` layout
   */
  justify?: 'start' | 'end'
}

export type LayoutTopic = HierarchyPointNode<TopicData>
export type HierarchyTopic = HierarchyNode<TopicData>
