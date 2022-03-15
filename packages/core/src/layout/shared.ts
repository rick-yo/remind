import { HierarchyNode, HierarchyPointNode } from 'd3-hierarchy'
import { TopicStyle, TopicTextRenderOptions } from '../constant'
import { HierarchyTopic, TopicData } from '../interface/topic'
import { average, toPX } from '../utils/common'
import { renderText } from '../utils/textRender'

function getTopicFontsize(node: HierarchyTopic) {
  const offset = (node.depth ?? 0) * 2
  return Math.max(14, TopicStyle.rootTopicFontSize - offset)
}

function getTopicTextStyle(node: HierarchyTopic) {
  const fontSize = toPX(getTopicFontsize(node))
  const textStyle = {
    fontSize,
    fontFamily: TopicStyle.fontFamily,
    lineHeight: `${TopicStyle.lineHeight}`,
  }
  return textStyle
}

function setNodeSize(node: HierarchyTopic) {
  const style = getTopicTextStyle(node)
  const {
    dimensions: { width, height },
  } = renderText(node.data.title, { ...TopicTextRenderOptions, style })
  const finalWidth = Math.min(
    width + TopicStyle.padding * 2,
    TopicStyle.maxWidth,
  )
  const finalHeight = Math.max(TopicStyle.minHeight, height)
  node.size = [finalWidth, finalHeight]
}

function getCanvasSize(layoutRoot: HierarchyPointNode<TopicData>) {
  // Compute canvas size
  const nodes = layoutRoot.descendants()
  const xs = nodes.map((node) => node.x)
  const ys = nodes.map((node) => node.y)
  const x0 = Math.min(...xs)
  const x1 = Math.max(...xs)
  const y0 = Math.min(...ys)
  const y1 = Math.max(...ys)
  const maxHeight = Math.max(...nodes.map((node) => node.size[1]))
  const canvasWidth = x1 - x0 + TopicStyle.maxWidth
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
  getTopicFontsize,
  setNodeSize,
  getCanvasSize,
  averageNodeSize,
  getTopicTextStyle,
  separateTree,
}
