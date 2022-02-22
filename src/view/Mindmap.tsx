import {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
  useState,
} from 'preact/hooks'
import hotkeys from 'hotkeys-js'
import { JSX } from 'preact'
import {
  EDITOR_MODE,
  EDITOR_ID,
  CORE_EDITOR_ID,
  TOPIC_CLASS,
  HOTKEYS,
  TopicStyle,
} from '../constant'
import { mindmap } from '../layout/mindmap'
import { Model } from '../model'
import { ViewModel } from '../viewModel'
import { createTopic } from '../utils/tree'
import { debug } from '../utils/debug'
import {
  selectText,
  useIconFont,
  useClickOutSide,
  usePassiveWheelEvent,
} from '../utils/dom'
import { useLocale } from '../context/locale'
import { ThemeContext } from '../context/theme'
import { assert } from '../utils/assert'
import { MindmapProps } from '../types'
import Toolbar from './Toolbar'
import Links from './Links'
import styles from './index.module.css'
import Topic from './Topic'

const Mindmap = (props: MindmapProps) => {
  const { onChange, contributions = [] } = props
  const model = Model.useContainer()
  const viewModel = ViewModel.useContainer()
  const { root } = model
  const theme = useContext(ThemeContext)
  const { scale, translate, mode, selectedNodeId } = viewModel
  const id = `#topic-${selectedNodeId}`
  const { canvasWidth, canvasHeight } = theme
  const mindMap = useMemo(() => {
    const map = mindmap(root)
    // Move mindmap to canvas central positon
    map.each((node) => {
      node.x += canvasWidth / 2 - TopicStyle.maxWidth
      node.y += canvasHeight / 2
    })
    return map
  }, [root, canvasWidth, canvasHeight])

  const locale = useLocale()
  const editorRef = useRef<HTMLDivElement>(null)
  const hotkeyOptions = {
    element: editorRef.current,
  }
  const [isDragging, setIsDragging] = useState(false)
  const [lastTouchPosition, setLastTouchPosition] = useState([0, 0])
  useIconFont()

  const topics: JSX.Element[] = useMemo(() => {
    const nodes: JSX.Element[] = []
    mindMap.each((node) => {
      nodes.push(
        <Topic key={node.data.id} node={node} contributions={contributions} />,
      )
    })
    return nodes
  }, [mindMap, contributions])

  // Regular mode
  useEffect(() => {
    function appendChild(e: KeyboardEvent) {
      e.preventDefault()
      if (!selectedNodeId) return
      model.appendChild(selectedNodeId, createTopic(locale.subTopic))
    }

    function editTopic(e: KeyboardEvent) {
      e.preventDefault()
      if (!selectedNodeId) return
      const element = document.querySelector<HTMLDivElement>(id)
      element?.focus()
      selectText(element!)
      viewModel.setMode(EDITOR_MODE.edit)
    }

    function deleteNode() {
      model.deleteNode(selectedNodeId)
    }

    if (mode === EDITOR_MODE.regular) {
      hotkeys(HOTKEYS.tab, hotkeyOptions, appendChild)
      hotkeys(HOTKEYS.space, hotkeyOptions, editTopic)
      hotkeys(HOTKEYS.backspace, hotkeyOptions, deleteNode)
    }

    return () => {
      hotkeys.unbind(HOTKEYS.tab, appendChild)
      hotkeys.unbind(HOTKEYS.space, editTopic)
      hotkeys.unbind(HOTKEYS.backspace, deleteNode)
    }
  }, [
    mode,
    selectedNodeId,
    id,
    locale.subTopic,
    hotkeyOptions,
    model,
    viewModel,
  ])

  // Regular mode, bind navigate shortcut
  useEffect(() => {
    function moveTop(e: KeyboardEvent) {
      e.preventDefault()
      viewModel.moveTop(mindMap)
    }

    function moveDown(e: KeyboardEvent) {
      e.preventDefault()
      viewModel.moveDown(mindMap)
    }

    function moveLeft(e: KeyboardEvent) {
      e.preventDefault()
      viewModel.moveLeft(mindMap)
    }

    function moveRight(e: KeyboardEvent) {
      e.preventDefault()
      viewModel.moveRight(mindMap)
    }

    if (mode === EDITOR_MODE.regular) {
      hotkeys(HOTKEYS.left, hotkeyOptions, moveLeft)
      hotkeys(HOTKEYS.right, hotkeyOptions, moveRight)
      hotkeys(HOTKEYS.up, hotkeyOptions, moveTop)
      hotkeys(HOTKEYS.down, hotkeyOptions, moveDown)
    }

    return () => {
      hotkeys.unbind(HOTKEYS.left, moveLeft)
      hotkeys.unbind(HOTKEYS.right, moveRight)
      hotkeys.unbind(HOTKEYS.up, moveTop)
      hotkeys.unbind(HOTKEYS.down, moveDown)
    }
  }, [mindMap, hotkeyOptions, mode, viewModel])

  // Regular mode, bind undo redo shortcut
  useEffect(() => {
    function undo() {
      model.undo()
    }

    function redo() {
      model.redo()
    }

    if (mode === EDITOR_MODE.regular) {
      hotkeys(HOTKEYS.undo, hotkeyOptions, undo)
      hotkeys(HOTKEYS.redo, hotkeyOptions, redo)
    }

    return () => {
      hotkeys.unbind(HOTKEYS.undo, undo)
      hotkeys.unbind(HOTKEYS.redo, redo)
    }
  }, [hotkeyOptions, mode, model])

  // Edit mode
  useClickOutSide(
    id,
    () => {
      if (mode !== EDITOR_MODE.edit) return
      if (!selectedNodeId) return
      viewModel.setMode(EDITOR_MODE.regular)
      const element = document.querySelector<HTMLDivElement>(id)
      model.updateNode(selectedNodeId, {
        title: element?.innerText,
      })
    },
    [mode, selectedNodeId, viewModel],
  )

  useClickOutSide(
    id,
    (e) => {
      if (!selectedNodeId) return
      assert(e.target instanceof HTMLDivElement)
      const isTopic = e.target?.closest(`.${TOPIC_CLASS}`)
      if (isTopic) return
      viewModel.selectNode('')
    },
    [selectedNodeId, viewModel],
  )

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.stopPropagation()
      e.preventDefault()
      viewModel.setTranslate([translate[0] - e.deltaX, translate[1] - e.deltaY])
    },
    [translate, viewModel],
  )

  usePassiveWheelEvent(editorRef, handleWheel)

  // Select root topic after initial render
  useEffect(() => {
    setTimeout(() => {
      viewModel.selectNode(root.id)
    }, 200)
  }, [root.id])

  debug('mindMap', mindMap)

  const handleDragStart = useCallback(() => {
    setLastTouchPosition([0, 0])
    setIsDragging(true)
  }, [])

  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      viewModel.setTranslate([
        translate[0] + e.movementX,
        translate[1] + e.movementY,
      ])
    },
    [isDragging, translate, viewModel],
  )

  const handleTouchDrag = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return
      const lastTouch = e.changedTouches[e.changedTouches.length - 1]
      if (!lastTouchPosition[0] && !lastTouchPosition[1]) {
        setLastTouchPosition([lastTouch.clientX, lastTouch.clientY])
        return
      }

      const deltaX = lastTouch.clientX - lastTouchPosition[0]
      const deltaY = lastTouch.clientY - lastTouchPosition[1]
      viewModel.setTranslate([translate[0] + deltaX, translate[1] + deltaY])
      setLastTouchPosition([lastTouch.clientX, lastTouch.clientY])
    },
    [isDragging, lastTouchPosition, translate, viewModel],
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    setLastTouchPosition([0, 0])
  }, [])

  useEffect(() => {
    onChange?.(root)
  }, [root])

  return (
    <div
      ref={editorRef}
      id={EDITOR_ID}
      className={styles.editorContainer}
      style={{
        fontFamily: TopicStyle.fontFamily,
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onMouseMove={handleDrag}
      onTouchMove={handleTouchDrag}
      onMouseUp={handleDragEnd}
      onTouchEnd={handleDragEnd}
    >
      <div
        id={CORE_EDITOR_ID}
        className={styles.editor}
        style={{
          transform: `scale(${scale}, ${scale})
            translate(${translate[0]}px, ${translate[1]}px)`,
        }}
      >
        <svg
          width={10_000}
          height={10_000}
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svgCanvas}
        >
          <Links mindmap={mindMap} />
        </svg>
        {topics}
      </div>
      <Toolbar />
    </div>
  )
}

export default Mindmap
