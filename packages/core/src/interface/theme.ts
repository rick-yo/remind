import { HierarchyTopic } from './topic'

interface Theme {
  link: {
    stroke: string
    strokeWidth: number
  }
  topic: {
    maxWidth: number
    minHeight: (node: HierarchyTopic) => number
    padding: (node: HierarchyTopic) => [number, number]
    margin: number
    borderWidth: number
    fontFamily: string
    lineHeight: number
    fontSize: (node: HierarchyTopic) => number
    color: (node: HierarchyTopic) => string
    fontWeight: (node: HierarchyTopic) => string
    background: (node: HierarchyTopic) => string
  }
  mainColor: string
}

export type { Theme }
