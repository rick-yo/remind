import { LayoutOption } from '../interface/layout'
import { LayoutTopic, TopicData } from '../interface/topic'
import { mindmap } from './mindmap'
import { getCanvasSize } from './shared'
import { structure } from './structure'

const canvasPadding = 10

function doLayout(root: TopicData, options: LayoutOption) {
  const { layout, theme } = options
  let layoutRoot: LayoutTopic
  switch (layout) {
    case 'mindmap':
      layoutRoot = mindmap(root, options)
      break
    case 'structure':
      layoutRoot = structure(root, options)
      break
    default:
      throw new Error('invalid layout')
  }

  layoutRoot.descendants().forEach((node) => {
    // add canvas padding
    node.x += canvasPadding
    node.y += canvasPadding
  })

  const [canvasWidth, canvasHeight] = getCanvasSize(theme, layoutRoot)
  return {
    layoutRoot,
    canvasWidth,
    canvasHeight,
  }
}

export { doLayout }
