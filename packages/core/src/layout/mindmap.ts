import { hierarchy, tree } from 'd3-hierarchy'
import { TopicStyle } from '../constant'
import { TopicData } from '../interface/topic'
import { averageNodeSize, setNodeSize } from './shared'

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
      const sep = Math.ceil(b.size[1] / ah) + 0.2
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

  const nodes = layoutRoot.descendants()
  const minY = Math.min(...nodes.map((node) => node.y))
  // Move layoutRoot to canvas center
  layoutRoot.each((node) => {
    node.x += TopicStyle.padding
    node.y -= minY - TopicStyle.padding
  })

  return layoutRoot
}

export { mindmap }
