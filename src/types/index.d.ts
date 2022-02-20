interface TopicData {
  id: string
  title: string
  children?: TopicData[]
  side?: 'left' | 'right'
  depth?: number
  parent?: TopicData
  data?: any
}

export type { TopicData }
