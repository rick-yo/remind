import { createContext } from 'preact'
import { Theme } from '../interface/theme'
import { HierarchyTopic } from '../interface/topic'

enum Color {
  white = '#fff',
  black = '#141414',
  red = '#F44336',
}

enum FontWeight {
  Regular = '400',
  Medium = '500',
}

const topic: Theme['topic'] = {
  maxWidth: 240,
  minHeight(node: HierarchyTopic) {
    const [vPadding] = topic.padding(node)
    return topic.fontSize(node) * topic.lineHeight + vPadding * 2
  },
  margin: 50,
  padding(node: HierarchyTopic) {
    const fontSize = topic.fontSize(node)
    return [fontSize / 2 + 2, fontSize]
  },
  borderWidth: 2,
  fontFamily: `"Microsoft Yahei", "PingFang SC"`,
  lineHeight: 1.2,
  fontSize(node: HierarchyTopic) {
    if (node.depth === 0) return 24
    if (node.depth === 1) return 18
    return 14
  },
  fontWeight(node: HierarchyTopic) {
    if (node.depth === 0) return FontWeight.Medium
    return FontWeight.Regular
  },
  color(node: HierarchyTopic) {
    if (node.depth === 0) return Color.white
    return Color.black
  },
  background(node: HierarchyTopic) {
    if (node.depth === 0) return Color.red
    return Color.white
  },
}

const defaultTheme: Theme = {
  link: {
    stroke: Color.white,
    strokeWidth: 3,
  },
  topic,
  mainColor: '#4dc4ff',
}

const ThemeContext = createContext(defaultTheme)

export { ThemeContext, defaultTheme }
