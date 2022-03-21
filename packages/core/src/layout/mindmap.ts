import { hierarchy } from 'd3-hierarchy'
import { LayoutOption } from '../interface/layout'
import { HierarchyTopic, TopicData } from '../interface/topic'
import { eachDF } from '../utils/tree'
import { separateTree, setNodeSize } from './shared'

const subTreeSeparation = 10
const margin = 50

function secondWalk(node: HierarchyTopic, options: LayoutOption) {
  let totalHeight = 0
  if (node.children?.length) {
    node.children.forEach((c) => {
      totalHeight += secondWalk(c, options)
    })
  } else {
    totalHeight = node.size[1]
  }

  node.totalHeight = Math.max(node.size[1], totalHeight) + subTreeSeparation
  return node.totalHeight
}

function thirdWalk(node: HierarchyTopic) {
  const children = node.children
  const len = children?.length
  if (len) {
    children.forEach((c) => {
      thirdWalk(c)
    })
    const first = children[0]
    const last = children[len - 1]
    const childrenHeight = last.y - first.y + last.size[1]
    let childrenTotalHeight = 0
    children.forEach((child) => {
      childrenTotalHeight += child.totalHeight
    })
    if (childrenHeight > node.size[1]) {
      // 当子节点总高度大于父节点高度
      node.y = first.y + childrenHeight / 2 - node.size[1] / 2
    } else if (children.length !== 1 || node.size[1] > childrenTotalHeight) {
      // 多于一个子节点或者父节点大于所有子节点的总高度
      const offset = node.y + (node.size[1] - childrenHeight) / 2 - first.y
      children.forEach((c) => {
        c.y += offset
      })
    } else {
      // 只有一个子节点
      node.y =
        (first.y + first.size[1] / 2 + last.y + last.size[1] / 2) / 2 -
        node.size[1] / 2
    }
  }
}

function layout(root: TopicData, options: LayoutOption) {
  const { theme } = options
  const hierarchyRoot = hierarchy(root)

  // Compute node size
  hierarchyRoot.descendants().forEach((node) => {
    setNodeSize(theme, node)
  })

  hierarchyRoot.parent = {
    x: 0,
    size: [0, 0],
    y: 0,
  } as any
  // first walk
  hierarchyRoot.each((node) => {
    // get x
    node.x = node.parent.x + node.parent.size[0] + margin
  })
  hierarchyRoot.parent = null
  // second walk
  // assign sub tree totalHeight
  secondWalk(hierarchyRoot, options)
  // separating nodes
  hierarchyRoot.startY = 0
  hierarchyRoot.y = hierarchyRoot.totalHeight / 2 - hierarchyRoot.size[1] / 2
  eachDF(hierarchyRoot, (node) => {
    const children = node.children
    const len = children?.length
    if (len) {
      const first = children[0]
      first.startY = node.startY + subTreeSeparation
      if (len === 1) {
        first.y = node.y + node.size[1] / 2 - first.size[1] / 2
      } else {
        first.y = first.startY + first.totalHeight / 2 - first.size[1] / 2
        for (let i = 1; i < len; i++) {
          const c = children[i]
          c.startY = children[i - 1].startY + children[i - 1].totalHeight
          c.y = c.startY + c.totalHeight / 2 - c.size[1] / 2
        }
      }
    }
  })

  // position parent to nodes's center
  thirdWalk(hierarchyRoot)
  return hierarchyRoot
}

function mindmap(root: TopicData, options: LayoutOption) {
  const [start, end] = separateTree(root)
  const layoutStart = layout(start, options)
  const layoutEnd = layout(end, options)

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
