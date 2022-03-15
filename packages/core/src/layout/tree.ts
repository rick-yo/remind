import { hierarchy, tree } from 'd3-hierarchy'
import { TopicStyle } from '../constant'
import { TopicData } from '../interface/topic'
import { averageNodeSize, setNodeSize } from './shared'

function structure(root: TopicData) {
  const hierarchyRoot = hierarchy(root)

  // Compute node size
  hierarchyRoot.descendants().forEach((node) => {
    setNodeSize(node)
  })

  const [aw, ah] = averageNodeSize(hierarchyRoot)

  const layoutRoot = tree<TopicData>()
    .nodeSize([aw, ah])
    .separation((a, b) => {
      const sep = (a.size[0] + b.size[0]) / aw / 2 + 0.2
      return a.parent === b.parent ? sep : sep + 0.2
    })(hierarchyRoot)

  layoutRoot.each((node) => {
    node.y += node.depth * TopicStyle.margin
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
