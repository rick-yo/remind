import { createContext } from 'preact'
import { Theme } from '../interface/theme'
import { HierarchyTopic } from '../interface/topic'

const topic = {
  maxWidth: 240,
  padding: 8,
  margin: 80,
  fontFamily: `"Microsoft Yahei", "PingFang SC"`,
  lineHeight: 1.2,
  borderWidth: 2,
  fontSize(node: HierarchyTopic) {
    if (node.depth === 0) return 30
    if (node.depth === 1) return 18
    return 14
  },
  minHeight(node: HierarchyTopic) {
    return topic.fontSize(node) * topic.lineHeight + topic.padding * 2
  },
}

const defaultTheme: Theme = {
  link: {
    stroke: '#000',
    strokeWidth: 0.5,
  },
  topic,
  mainColor: '#4dc4ff',
}

const ThemeContext = createContext(defaultTheme)

export { ThemeContext, defaultTheme }
