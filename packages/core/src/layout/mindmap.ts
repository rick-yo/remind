import { hierarchy, HierarchyNode, tree } from 'd3-hierarchy'
import { canvasContext, TopicStyle } from '../constant'
import { TopicData } from '../interface/topic'
import { sum } from '../utils/common'

export function getTopicFontsize(node: TopicData) {
  const offset = (node.depth ?? 0) * 2
  return `${Math.max(14, TopicStyle.fontSize - offset)}`
}

const canvasPadding = 10

// WARN fontSize is diffrent between topic, should fix this to get correct topic width and height
function measureText(node: TopicData) {
  const fontSize = getTopicFontsize(node)
  canvasContext.save()
  canvasContext.font = `${fontSize}px ${TopicStyle.fontFamily}`
  const measure = canvasContext.measureText(node.title)
  canvasContext.restore()
  return measure
}

function setNodeSize(node: HierarchyNode<TopicData>) {
  const measure = measureText(node.data)
  const width = Math.min(
    measure.width + TopicStyle.padding * 2,
    TopicStyle.maxWidth,
  )
  const lines = Math.ceil(width / TopicStyle.maxWidth)
  const height = Math.max(
    TopicStyle.minHeight,
    TopicStyle.fontSize * lines * TopicStyle.lineHeight +
      TopicStyle.padding * 2,
  )
  node.size = [width, height]
}

declare module 'd3-hierarchy' {
  export interface HierarchyNode<Datum> {
    /**
     * The associated data, as specified to the constructor.
     */
    data: Datum
    size: [number, number]
    canvasWidth: number
  }
}

function mindmap(root: TopicData) {
  const hierarchyRoot = hierarchy(root)

  // Compute node size
  hierarchyRoot.descendants().forEach((node) => {
    setNodeSize(node)
  })

  const sizes = hierarchyRoot.descendants().map((node) => node.size)
  const averageNodeSize: [number, number] = [
    sum(
      sizes.map((size) => {
        return size[0]
      }),
    ) / sizes.length,
    sum(
      sizes.map((size) => {
        return size[1]
      }),
    ) / sizes.length,
  ]

  const layoutRoot = tree<TopicData>()
    .nodeSize(averageNodeSize)
    .separation((a, b) => (a.parent === b.parent ? 0.8 : 1))(hierarchyRoot)

  layoutRoot.each((node) => {
    // Rotate entire tree
    const { x, y, depth } = node
    node.x = y
    node.y = x
    // Reduce margin
    node.x += depth * TopicStyle.margin
  })

  // Compute canvas size
  const nodes = layoutRoot.descendants()
  const xs = nodes.map((node) => node.x)
  const ys = nodes.map((node) => node.y)
  const heights = nodes.map((node) => node.size[1])
  const x0 = Math.min(...xs)
  const x1 = Math.max(...xs)
  const y0 = Math.min(...ys)
  const y1 = Math.max(...ys)
  const maxHeight = Math.max(...heights)
  const canvasWidth = x1 - x0 + TopicStyle.maxWidth
  const canvasHeight = y1 - y0 + maxHeight

  // Move mindmap to canvas central positon
  layoutRoot.each((node) => {
    node.x += canvasPadding
    node.y += canvasHeight / 2 - TopicStyle.minHeight / 2
  })

  return {
    layoutRoot,
    canvasWidth,
    canvasHeight,
  }
}

export { mindmap }
