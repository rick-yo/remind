import { HierarchyTopic } from './topic'

interface Theme {
  link: {
    stroke: string
    strokeWidth: number
  }
  topic: {
    maxWidth: number
    margin: number
    padding: number
    fontFamily: string
    lineHeight: number
    borderWidth: number
    fontSize: (node: HierarchyTopic) => number
    minHeight: (node: HierarchyTopic) => number
  }
  mainColor: string
}

export type { Theme }
