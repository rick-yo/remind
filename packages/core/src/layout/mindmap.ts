import { hierarchy, tree } from 'd3-hierarchy'
import { TopicStyle } from '../constant'
import { TopicData } from '../interface/topic'
import {
  averageNodeSize,
  getCanvasSize,
  move2Center,
  setNodeSize,
} from './shared'

function mindmap(root: TopicData) {
  const hierarchyRoot = hierarchy(root)

  // Compute node size
  hierarchyRoot.descendants().forEach((node) => {
    setNodeSize(node)
  })

  const [aw, ah] = averageNodeSize(hierarchyRoot)

  const layoutRoot = tree<TopicData>()
    .nodeSize([ah, aw])
    .separation((a, b) => {
      const sep = Math.ceil(b.size[1] / ah) + 0.5
      return a.parent === b.parent ? sep : sep + 0.5
    })(hierarchyRoot)

  layoutRoot.each((node) => {
    // Rotate entire tree
    const { x, y, depth } = node
    node.x = y
    node.y = x
    // Add horizontal margin
    node.x += depth * TopicStyle.margin
  })

  const [canvasWidth, canvasHeight] = getCanvasSize(layoutRoot)

  move2Center(layoutRoot)

  return {
    layoutRoot,
    canvasWidth,
    canvasHeight,
  }
}

export { mindmap }
