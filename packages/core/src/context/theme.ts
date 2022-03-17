import { createContext } from 'preact'
import { Color, FontWeight } from '../constant'
import type { Theme } from '../interface/theme'
import { HierarchyTopic } from '../interface/topic'
import { topicType } from '../utils/is'
import { horizontalLinkRender, verticalLinkRender } from '../utils/link'

const topic: Theme['topic'] = {
  maxWidth: 240,
  minHeight(node: HierarchyTopic) {
    const [vPadding] = topic.padding(node)
    return topic.fontSize(node) * topic.lineHeight + vPadding * 2
  },
  margin: [100, 50],
  padding(node: HierarchyTopic) {
    const fontSize = topic.fontSize(node)
    return [fontSize / 2 + 2, fontSize]
  },
  borderWidth: 2,
  borderColor: '#4dc4ff',
  fontFamily: `"Microsoft Yahei", "PingFang SC"`,
  lineHeight: 1.2,
  fontSize(node: HierarchyTopic) {
    if (topicType.isRoot(node)) return 24
    if (topicType.isMain(node)) return 18
    return 14
  },
  fontWeight(node: HierarchyTopic) {
    if (topicType.isRoot(node)) return FontWeight.Medium
    return FontWeight.Regular
  },
  color(node: HierarchyTopic) {
    if (topicType.isRoot(node)) return Color.white
    return Color.black
  },
  background(node: HierarchyTopic) {
    if (topicType.isRoot(node)) return Color.red
    return Color.white
  },
}

const defaultTheme: Theme = {
  link: {
    render(parent, child, options) {
      if (options.layout === 'mindmap')
        return horizontalLinkRender(parent, child, options)
      return verticalLinkRender(parent, child, options)
    },
  },
  topic,
}

const ThemeContext = createContext(defaultTheme)

export { ThemeContext, defaultTheme }
