import { HierarchyPointNode, HierarchyNode } from 'd3-hierarchy'

export interface TopicData {
  id: string
  title: string
  children?: TopicData[]
}

export type LayoutTopic = HierarchyPointNode<TopicData>
export type HierarchyTopic = HierarchyNode<TopicData>
