import { hierarchy, tree } from 'd3-hierarchy'
import { LayoutOption } from '../interface/layout'
import { TopicData } from '../interface/topic'
import { averageNodeSize, setNodeSize } from './shared'

function structure(root: TopicData, options: LayoutOption) {
  const { theme } = options
  const {
    topic: { margin },
  } = theme
  const hierarchyRoot = hierarchy(root)

  // Compute node size
  hierarchyRoot.descendants().forEach((node) => {
    setNodeSize(theme, node)
  })

  const [aw, ah] = averageNodeSize(hierarchyRoot)

  const layoutRoot = tree<TopicData>()
    .nodeSize([aw, ah])
    .separation((a, b) => {
      const sep = a.size[0] / aw + 0.2
      return a.parent === b.parent ? sep : sep + 0.2
    })(hierarchyRoot)

  layoutRoot.each((node) => {
    const { parent } = node
    // Add vertical margin
    if (parent) {
      node.y -= node.y - (parent.y + parent.size[1])
      node.y += margin
    }
  })

  // adjust layout to canvas center
  const nodes = layoutRoot.descendants()
  const minX = Math.min(...nodes.map((node) => node.x))
  layoutRoot.each((node) => {
    node.x -= minX
  })

  return layoutRoot
}

export { structure }
