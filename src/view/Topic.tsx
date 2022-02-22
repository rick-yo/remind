import { useContext, useState } from 'preact/hooks'
import { ThemeContext } from '../context/theme'
import { EDITOR_MODE, KEY_MAPS, TopicStyle, TOPIC_CLASS } from '../constant'
import { getTopicFontsize } from '../layout/mindmap'
import { ViewModel } from '../viewModel'
import { Model } from '../model'
import { assert } from '../utils/assert'
import { LayoutNode, TopicData } from '../types'
import { classNames, toPX } from '../utils/common'
import { Contribution, useTopicContributions } from '../contribute'
import styles from './index.module.css'

const topicClass = classNames(TOPIC_CLASS, styles.topic)

type TopicProps = {
  node: LayoutNode
  contributions: Contribution[]
}

const Topic = (props: TopicProps) => {
  const { node, contributions } = props
  const {
    data: { title, id },
    x,
    y,
    depth,
  } = node
  const { events } = useTopicContributions(contributions, node)

  const $theme = useContext(ThemeContext)
  const viewModel = ViewModel.useContainer()
  const model = Model.useContainer()
  const { root } = model
  const { mode, selectedNodeId } = viewModel
  const isSelected = id === selectedNodeId
  const isEditing = isSelected && mode === EDITOR_MODE.edit
  const [isDragEntering, setIsDragEntering] = useState(false)
  const isMainTopic = depth <= 1

  function handleDragStart(e: DragEvent) {
    // Root node is not draggable
    if (id === root.id) {
      e.preventDefault()
      return
    }

    assert(e.dataTransfer instanceof HTMLDivElement)
    // SetData dataTransfer to make drag and drop work in firefox
    e.dataTransfer.setData('text/plain', '')
    viewModel.dragNode(node.data)
  }

  function handleDragEnter() {
    setIsDragEntering(true)
  }

  function handleDragLeave() {
    setIsDragEntering(false)
  }

  function handleDrop() {
    if (!viewModel.dragingNode) return
    if (viewModel.dragingNode.id === id) return
    // Should not drop topic to it's descendants
    const descendants: TopicData[] = []
    if (descendants.some((node) => node.id === id)) {
      return
    }

    model.appendChild(id, viewModel.dragingNode)
    handleDragLeave()
  }

  // We need to prevent the default behavior
  // of this event, in order for the onDrop
  // event to fire.
  // It may sound weird, but the default is
  // to cancel out the drop.
  function handleDragOver(e: DragEvent) {
    e.preventDefault()
  }

  const outline =
    isSelected || isDragEntering ? `2px solid ${$theme.mainColor}` : 'none'
  const background = isMainTopic || isEditing ? '#fff' : 'transparent'

  // PreventDefault to prevent enter keyboard event create new html element
  function handleKeyDown(e: KeyboardEvent) {
    if ([KEY_MAPS.Enter].includes(e.key) && mode === EDITOR_MODE.edit) {
      e.preventDefault()
    }
  }

  return (
    <div
      id={`topic-${id}`}
      className={topicClass}
      contentEditable={isEditing}
      onKeyDown={handleKeyDown}
      draggable
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
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
      {...events}
    >
      {title}
    </div>
  )
}

export default Topic
