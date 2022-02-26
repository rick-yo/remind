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
  const { mode, selection } = viewModel
  const isSelected = id === selection
  const isEditing = isSelected && mode === EDITOR_MODE.edit
  const isMainTopic = depth <= 1

  const outline = isSelected ? `2px solid ${$theme.mainColor}` : 'none'
  const background = isMainTopic || isEditing ? '#fff' : 'transparent'

  return (
    <div
      className={styles.topic}
      data-id={id}
      data-type={ViewType.topic}
      contentEditable={isEditing}
      draggable
      style={{
        transform: `translate(${toPX(x)}, ${toPX(y)}) scale(${
          isEditing ? '1.05' : 1
        })`,
        maxWidth: toPX(TopicStyle.maxWidth),
        padding: toPX(TopicStyle.padding),
        background: `${background}`,
        fontSize: toPX(getTopicFontsize(node.data)),
        fontFamily: TopicStyle.fontFamily,
        lineHeight: TopicStyle.lineHeight,
        outline: `${outline}`,
        borderRadius: toPX(5),
      }}
    >
      {title}
    </div>
  )
}

export default Topic
