import { HierarchyNode } from 'd3-hierarchy'
import { Theme } from '../interface/theme'
import { HierarchyTopic, LayoutTopic, TopicData } from '../interface/topic'
import { average, maxBy, minBy, toPX } from '../utils/common'
import { renderText, TextRenderOption } from '../utils/textRender'

const createTopicTextRenderBox = (
  theme: Theme,
  node: HierarchyTopic,
): Omit<TextRenderOption, 'style'> => {
  const {
    topic: { maxWidth, padding },
  } = theme
  const [vp, hp] = padding(node)

  return {
    box: {
      width: maxWidth,
      height: 10_000,
    },
    padding: {
      top: vp,
      bottom: vp,
      left: hp,
      right: hp,
    },
  }
}

function getTopicTextStyle(theme: Theme, node: HierarchyTopic) {
  const {
    topic: { fontSize, fontFamily, lineHeight, color, background, fontWeight },
  } = theme
  const textStyle = {
    fontSize: toPX(fontSize(node)),
    fontFamily,
    lineHeight: `${lineHeight}`,
    color: color(node),
    background: background(node),
    borderRadius: toPX(6),
    fontWeight: fontWeight(node),
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
  } = renderText(node.data.title, {
    ...createTopicTextRenderBox(theme, node),
    style,
  })
  const finalWidth = Math.min(width + padding(node)[1] * 2, maxWidth)
  const finalHeight = Math.max(minHeight(node), height)
  node.size = [finalWidth, finalHeight]
}

const byLeft = (node: LayoutTopic) => node.x
const byRight = (node: LayoutTopic) => node.x + node.size[0]
const byTop = (node: LayoutTopic) => node.y
const byBottom = (node: LayoutTopic) => node.y + node.size[1]

/**
 * get dimension of node, include it's child node
 */
export function getNodeDimension(node: LayoutTopic) {
  // Compute node size
  const nodes = node.descendants()
  const x0 = minBy(nodes, byLeft)
  const x1 = maxBy(nodes, byRight)
  const y0 = minBy(nodes, byTop)
  const y1 = maxBy(nodes, byBottom)
  const width = x1.x + x1.size[0] - x0.x
  const height = y1.y + y1.size[1] - y0.y
  return [width, height]
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
  averageNodeSize,
  getTopicTextStyle,
  separateTree,
  createTopicTextRenderBox,
}
