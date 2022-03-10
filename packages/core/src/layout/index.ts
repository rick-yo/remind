import { LayoutType } from '../interface/layout'
import { LayoutNode, TopicData } from '../interface/topic'
import { mindmap } from './mindmap'
import { getCanvasSize } from './shared'
import { structure } from './tree'

function doLayout(root: TopicData, layout: LayoutType) {
  let layoutRoot: LayoutNode
  switch (layout) {
    case 'mindmap':
      layoutRoot = mindmap(root)
      break
    case 'structure':
      layoutRoot = structure(root)
      break
    default:
      throw new Error('invalid layout')
  }

  const [canvasWidth, canvasHeight] = getCanvasSize(layoutRoot)
  return {
    layoutRoot,
    canvasWidth,
    canvasHeight,
  }
}

export { doLayout }
