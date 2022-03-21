import type { LayoutTopic, LayoutType, TopicData } from '..'
import { HierarchyTopic } from './topic'

type LinkRender = (
  parent: LayoutTopic,
  child: LayoutTopic,
  options: {
    layout: LayoutType
    justify: TopicData['justify']
  },
) => JSX.Element

interface Theme {
  /**
   * customize link style
   */
  link: {
    render: LinkRender
  }
  /**
   * customize topic style
   */
  topic: {
    maxWidth: number
    minHeight: (node: HierarchyTopic) => number
    padding: (node: HierarchyTopic) => [number, number]
    borderWidth: number
    borderColor: string
    background: (node: HierarchyTopic) => string
    fontFamily: string
    lineHeight: number
    fontSize: (node: HierarchyTopic) => number
    color: (node: HierarchyTopic) => string
    fontWeight: (node: HierarchyTopic) => string
  }
}

export type { Theme, LinkRender }
