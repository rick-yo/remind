import { useContext, useState } from 'preact/hooks'
import { ThemeContext } from '../context/theme'
import { EDITOR_MODE, KEY_MAPS, TopicStyle, TOPIC_CLASS } from '../constant'
import { getTopicFontsize } from '../layout/mindmap'
import { selectText } from '../utils/dom'
import { ViewModel } from '../viewModel'
import { Model } from '../model'
import { assert } from '../utils/assert'
import { LayoutNode, TopicData } from '../types'
import { classNames, toPX } from '../utils/common'
import styles from './index.module.css'

const topicClass = classNames(TOPIC_CLASS, styles.topic)

const Topic = (props: LayoutNode) => {
  const {
    data: { title, id },
    x,
    y,
    depth,
  } = props
  const $theme = useContext(ThemeContext)
  const viewModel = ViewModel.useContainer()
  const model = Model.useContainer()
  const { root } = model
  const { mode, selectedNodeId } = viewModel
  const isSelected = id === selectedNodeId
  const isEditing = isSelected && mode === EDITOR_MODE.edit
  const [isDragEntering, setIsDragEntering] = useState(false)
  const isMainTopic = depth <= 1

  function selectNode() {
    viewModel.selectNode(id)
  }

  function exitEditMode(e: KeyboardEvent) {
    if (
      [KEY_MAPS.Enter, KEY_MAPS.Escape].includes(e.key) &&
      mode === EDITOR_MODE.edit
    ) {
      viewModel.setMode(EDITOR_MODE.regular)
      assert(e.currentTarget instanceof HTMLDivElement)
      model.updateNode(id, {
        title: e.currentTarget.textContent ?? '',
      })
      // Fix selection exit after exit edit mode on firefox
      getSelection()?.removeAllRanges()
    }
  }

  function handleDragStart(e: DragEvent) {
    // Root node is not draggable
    if (id === root.id) {
      e.preventDefault()
      return
    }

    assert(e.dataTransfer instanceof HTMLDivElement)
    // SetData dataTransfer to make drag and drop work in firefox
    e.dataTransfer.setData('text/plain', '')
    viewModel.dragNode(props.data)
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

  function editTopic(e: MouseEvent) {
    const element = e.target as HTMLDivElement
    element?.focus()
    selectText(element)
    viewModel.setMode(EDITOR_MODE.edit)
  }

  return (
    <div
      id={`topic-${id}`}
      className={topicClass}
      contentEditable={isEditing}
      onClick={selectNode}
      onDblClick={editTopic}
      onKeyUp={exitEditMode}
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
        fontSize: toPX(getTopicFontsize(props.data)),
        outline: `${outline}`,
        translate: `0 ${isEditing ? '2px' : 0}`,
      }}
    >
      {title}
    </div>
  )
}

export default Topic