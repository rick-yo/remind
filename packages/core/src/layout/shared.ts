import { HierarchyNode, HierarchyPointNode } from 'd3-hierarchy'
import { Theme } from '../interface/theme'
import { HierarchyTopic, TopicData } from '../interface/topic'
import { average, toPX } from '../utils/common'
import { renderText, TextRenderOption } from '../utils/textRender'

const createTopicTextRenderBox = (
  theme: Theme,
): Omit<TextRenderOption, 'style'> => {
  const {
    topic: { maxWidth, padding },
  } = theme

  return {
    box: {
      width: maxWidth,
      height: 10_000,
    },
    padding,
  }
}

function getTopicTextStyle(theme: Theme, node: HierarchyTopic) {
  const {
    topic: { fontSize, fontFamily, lineHeight },
  } = theme
  const textStyle = {
    fontSize: toPX(fontSize(node)),
    fontFamily,
    lineHeight: `${lineHeight}`,
  }
  return textStyle
}

function setNodeSize(theme: Theme, node: HierarchyTopic) {
  const style = getTopicTextStyle(theme, node)
  const {
    topic: { maxWidth, padding, minHeight },
  } = theme
  const {
    dimensions: { width, height },
  } = renderText(node.data.title, { ...createTopicTextRenderBox(theme), style })
  const finalWidth = Math.min(width + padding * 2, maxWidth)
  const finalHeight = Math.max(minHeight(node), height)
  node.size = [finalWidth, finalHeight]
}

function getCanvasSize(
  theme: Theme,
  layoutRoot: HierarchyPointNode<TopicData>,
) {
  // Compute canvas size
  const nodes = layoutRoot.descendants()
  const xs = nodes.map((node) => node.x)
  const ys = nodes.map((node) => node.y)
  const x0 = Math.min(...xs)
  const x1 = Math.max(...xs)
  const y0 = Math.min(...ys)
  const y1 = Math.max(...ys)
  const maxHeight = Math.max(...nodes.map((node) => node.size[1]))
  const canvasWidth = x1 - x0 + theme.topic.maxWidth
  const canvasHeight = y1 - y0 + maxHeight * 2
  return [canvasWidth, canvasHeight]
}

function averageNodeSize(hierarchyRoot: HierarchyNode<TopicData>) {
  const sizes = hierarchyRoot.descendants().map((node) => node.size)
  const aw = average(
    sizes.map((size) => {
      return size[0]
    }),
  )
  const ah = average(
    sizes.map((size) => {
      return size[1]
    }),
  )
  return [aw, ah]
}

function separateTree(root: TopicData): [TopicData, TopicData] {
  const start = root.children?.filter((node) => node.justify === 'start')
  const end = root.children?.filter((node) => !start?.includes(node))

  return [
    {
      ...root,
      children: start,
    },
    {
      ...root,
      children: end,
    },
  ]
}

export {
  setNodeSize,
  getCanvasSize,
  averageNodeSize,
  getTopicTextStyle,
  separateTree,
  createTopicTextRenderBox,
}
