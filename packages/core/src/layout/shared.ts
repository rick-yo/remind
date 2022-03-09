import { HierarchyNode, HierarchyPointNode } from 'd3-hierarchy'
import { canvasContext, TopicStyle } from '../constant'
import { TopicData } from '../interface/topic'
import { average } from '../utils/common'

declare module 'd3-hierarchy' {
  export interface HierarchyNode<Datum> {
    /**
     * The associated data, as specified to the constructor.
     */
    data: Datum
    size: [number, number]
  }
}

function getTopicFontsize(node: TopicData) {
  const offset = (node.depth ?? 0) * 2
  return `${Math.max(14, TopicStyle.fontSize - offset)}`
}

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
  const noWrapTextWidth = measure.width + TopicStyle.padding * 2
  const lines = Math.ceil(noWrapTextWidth / TopicStyle.maxWidth)
  const height = Math.max(
    TopicStyle.minHeight,
    TopicStyle.fontSize * lines * TopicStyle.lineHeight +
      TopicStyle.padding * 2,
  )
  node.size = [Math.min(noWrapTextWidth, TopicStyle.maxWidth), height]
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

export {
  getTopicFontsize,
  measureText,
  setNodeSize,
  getCanvasSize,
  averageNodeSize,
}
