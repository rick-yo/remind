import { HierarchyPointNode } from 'd3-hierarchy'
import { Theme } from '../context/theme'
import { Contribution } from '../contribute'
import { IntlKey } from '../utils/Intl'

interface TopicData {
  id: string
  title: string
  children?: TopicData[]
  side?: 'left' | 'right'
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
