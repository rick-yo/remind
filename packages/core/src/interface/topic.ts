import { HierarchyPointNode } from 'd3-hierarchy'

interface TopicData {
  id: string
  title: string
  children?: TopicData[]
  depth?: number
}

type LayoutNode = HierarchyPointNode<TopicData>

export type { TopicData, LayoutNode }
