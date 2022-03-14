import { hierarchy, tree } from 'd3-hierarchy'
import { TopicStyle } from '../constant'
import { TopicData } from '../interface/topic'
import { averageNodeSize, separateTree, setNodeSize } from './shared'

function layout(root: TopicData) {
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
    const { x, y, parent } = node
    node.x = y
    node.y = x
    // Add horizontal margin
    if (parent) {
      node.x -= node.x - (parent.x + parent.size[0])
      node.x += TopicStyle.margin
    }
  })
  return layoutRoot
}

function mindmap(root: TopicData) {
  const [start, end] = separateTree(root)
  const layoutStart = layout(start)
  const layoutEnd = layout(end)

  layoutStart.descendants().forEach((node) => {
    node.x += node.size[0]
    node.x = -node.x + layoutStart.size[0]
  })

  layoutStart.children?.forEach((mainNode) => {
    layoutEnd.children?.push(mainNode)
  })

  // adjust layout to canvas center
  const nodes = layoutEnd.descendants()
  const minX = Math.min(...nodes.map((node) => node.x))
  const minY = Math.min(...nodes.map((node) => node.y))
  layoutEnd.each((node) => {
    node.x -= minX
    node.y -= minY
  })

  return layoutEnd
}

export { mindmap }
