import React, { FC } from 'react'
import Topic from './components/Topic'
import { TreeNode } from './types/xmind'
import hierarchy, { Options } from '@antv/hierarchy'
import { CANVAS_WIDTH, CANVAS_HEIGHT, TOPIC_FONT_SIZE } from './constant'
import { useStoreDispatch } from './store'
import { setTheme } from './store/editor/action'

export interface XminderProps {
  theme: string
  // data: TreeNode
}

const root = {
  isRoot: true,
  id: 'Root',
  children: [
    {
      id: 'SubTreeNode1',
      children: [
        {
          id: 'SubTreeNode1.1'
        },
        {
          id: 'SubTreeNode1.2'
        }
      ]
    },
    {
      id: 'SubTreeNode2'
    }
  ]
}

const hierarchyOption: Options<typeof root> = {
  getSubTreeSep(d) {
    if (!d.children || !d.children.length) {
      return 0
    }
    return 100
  },
  getWidth(d) {
    return TOPIC_FONT_SIZE * d.id.length
  }
}

const Xminder: FC<XminderProps> = (props: XminderProps) => {
  const { theme } = props
  const dispatch = useStoreDispatch()
  dispatch(setTheme(theme))
  const rootWithCoords = hierarchy.mindmap(root, hierarchyOption)
  rootWithCoords.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
  let topics: React.ReactElement[] = []
  rootWithCoords.eachNode((node: any) => {
    const { data, x, y, id } = node
    topics.push(<Topic key={id} title={data.id} x={x} y={y} />)
  })
  return (
    <svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} xmlns="http://www.w3.org/2000/svg">
      {topics}
    </svg>
  )
}

export default Xminder
