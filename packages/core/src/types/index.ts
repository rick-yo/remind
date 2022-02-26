import { Theme } from '../context/theme'
import { Contribution } from '../contribute'
import { IntlKey } from '../utils/Intl'
import { HierarchyPointNode } from 'd3-hierarchy'

interface TopicData {
  id: string
  title: string
  children?: TopicData[]
  depth?: number
}

interface MindmapProps {
  theme?: Partial<Theme>
  locale?: IntlKey
  value?: TopicData
  onChange?: (value: TopicData) => void
  contributions?: Contribution[]
}

type LayoutNode = HierarchyPointNode<TopicData>

export type { TopicData, MindmapProps, LayoutNode }
