import { useContext } from 'preact/hooks'
import { ThemeContext } from '../context/theme'
import { EDITOR_MODE, TopicStyle } from '../constant'
import { getTopicFontsize } from '../layout/mindmap'
import { ViewModel } from '../viewModel'
import { LayoutNode } from '../types'
import { toPX } from '../utils/common'
import { ViewType } from '../contribute'
import styles from './index.module.css'

type TopicProps = {
  node: LayoutNode
}

const Topic = (props: TopicProps) => {
  const { node } = props
  const {
    data: { title, id },
    x,
    y,
    depth,
  } = node

  const $theme = useContext(ThemeContext)
  const viewModel = ViewModel.useContainer()
  const { mode, selectedNodeId } = viewModel
  const isSelected = id === selectedNodeId
  const isEditing = isSelected && mode === EDITOR_MODE.edit
  const isMainTopic = depth <= 1

  const outline = isSelected ? `2px solid ${$theme.mainColor}` : 'none'
  const background = isMainTopic || isEditing ? '#fff' : 'transparent'

  return (
    <div
      id={`topic-${id}`}
      className={styles.topic}
      data-id={id}
      data-type={ViewType.topic}
      contentEditable={isEditing}
      draggable
      // StopPropagation to prevent invoke Mindmap's event
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
      onTouchStart={(e) => {
        e.stopPropagation()
      }}
      style={{
        borderRadius: `${TopicStyle.radius}px`,
        transform: `translate(${x}px, ${y}px)`,
        background: `${background}`,
        maxWidth: toPX(TopicStyle.maxWidth),
        padding: toPX(TopicStyle.padding),
        fontSize: toPX(getTopicFontsize(node.data)),
        outline: `${outline}`,
        translate: `0 ${isEditing ? '2px' : 0}`,
      }}
    >
      {title}
    </div>
  )
}

export default Topic
