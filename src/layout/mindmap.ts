import { hierarchy, HierarchyPointNode, tree } from 'd3-hierarchy'
import { canvasContext, TopicStyle } from '../constant'
import { TopicData } from '../types'

export function getTopicFontsize(node: TopicData) {
  const fontSizeOffset = node.depth ?? 0 * 5
  const fontSize = `${Math.max(16, TopicStyle.fontSize - fontSizeOffset)}`
  return fontSize
}

// WARN fontSize is diffrent between topic, should fix this to get correct topic width and height
function measureText(node: TopicData) {
  const fontSize = getTopicFontsize(node)
  canvasContext.save()
  canvasContext.font = `${fontSize}px ${TopicStyle.fontFamily}`
  const measure = canvasContext.measureText(node.title)
  canvasContext.restore()
  return measure
}

declare module 'd3-hierarchy' {
  export interface HierarchyPointNode<Datum> extends HierarchyNode<Datum> {
    size: [number, number]
  }
}

function mindmap(root: TopicData): HierarchyPointNode<TopicData> {
  const rootNode = hierarchy(root)
  const layoutNode = tree<TopicData>()
    .nodeSize([150, 40])
    .separation((a, b) => (a.parent === b.parent ? 1 : 1))(rootNode)

  layoutNode.each((node) => {
    // Rotate entire tree
    const { x, y, depth } = node
    node.x = y
    node.y = x
    // Reduce margin
    node.x += depth * 140
    // Compute node size
    const measure = measureText(node.data)
    const width = Math.min(measure.width, TopicStyle.maxWidth)
    const lines = Math.ceil(width / TopicStyle.maxWidth)
    const height = Math.max(
      TopicStyle.minHeight,
      TopicStyle.fontSize * lines * 1.2,
    )
    node.size = [width, height]
  })
  return layoutNode
}

export { mindmap }
