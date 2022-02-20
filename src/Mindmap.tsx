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
import Topic from './components/Topic'
import {
  EDITOR_MODE,
  EDITOR_ID,
  TOPIC_FONT_FAMILY,
  CORE_EDITOR_ID,
  TOPIC_CLASS,
  HOTKEYS,
  TOPIC_HORIZENTAL_MARGIN,
} from './constant'
import { mindmap } from './layout/mindmap'
import Links from './components/Links'
import { useRootSelector, RootStore } from './store/root'
import EditorStore from './store/editor'
import { createTopic } from './utils/tree'
import { debug } from './utils/debug'
import {
  selectText,
  useIconFont,
  useClickOutSide,
  usePassiveWheelEvent,
} from './utils/dom'
import styles from './index.module.css'
import Toolbar from './components/Toolbar'
import { useLocale } from './context/locale'
import { ThemeContext } from './context/theme'
import { assert } from './utils/assert'

const Mindmap = () => {
  const root = useRootSelector((s) => s)
  const rootStore = RootStore.useContainer()
  const editorStore = EditorStore.useContainer()
  const theme = useContext(ThemeContext)
  const { scale, translate, mode, selectedNodeId } = editorStore
  const id = `#topic-${selectedNodeId}`
  const { canvasWidth, canvasHeight } = theme
  const mindMap = useMemo(() => {
    const map = mindmap(root)
    // Move mindmap to canvas central positon
    map.eachNode((node) => {
      node.x += canvasWidth / 2 - TOPIC_HORIZENTAL_MARGIN
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
    mindMap.eachNode((node) => {
      nodes.push(<Topic key={node.data.id} {...node} />)
    })
    return nodes
  }, [mindMap])

  // Regular mode
  useEffect(() => {
    function appendChild(e: KeyboardEvent) {
      e.preventDefault()
      if (!selectedNodeId) return
      rootStore.appendChild(selectedNodeId, createTopic(locale.subTopic))
    }

    function editTopic(e: KeyboardEvent) {
      e.preventDefault()
      if (!selectedNodeId) return
      const element = document.querySelector<HTMLDivElement>(id)
      element?.focus()
      selectText(element!)
      editorStore.setMode(EDITOR_MODE.edit)
    }

    function deleteNode() {
      rootStore.deleteNode(selectedNodeId)
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
    rootStore,
    editorStore,
  ])

  // Regular mode, bind navigate shortcut
  useEffect(() => {
    function moveTop(e: KeyboardEvent) {
      e.preventDefault()
      editorStore.moveTop(mindMap)
    }

    function moveDown(e: KeyboardEvent) {
      e.preventDefault()
      editorStore.moveDown(mindMap)
    }

    function moveLeft(e: KeyboardEvent) {
      e.preventDefault()
      editorStore.moveLeft(mindMap)
    }

    function moveRight(e: KeyboardEvent) {
      e.preventDefault()
      editorStore.moveRight(mindMap)
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
  }, [mindMap, hotkeyOptions, mode, editorStore])

  // Regular mode, bind undo redo shortcut
  useEffect(() => {
    function undo() {
      rootStore.undo()
    }

    function redo() {
      rootStore.redo()
    }

    if (mode === EDITOR_MODE.regular) {
      hotkeys(HOTKEYS.undo, hotkeyOptions, undo)
      hotkeys(HOTKEYS.redo, hotkeyOptions, redo)
    }

    return () => {
      hotkeys.unbind(HOTKEYS.undo, undo)
      hotkeys.unbind(HOTKEYS.redo, redo)
    }
  }, [hotkeyOptions, mode, rootStore])

  // Edit mode
  useClickOutSide(
    id,
    () => {
      if (mode !== EDITOR_MODE.edit) return
      if (!selectedNodeId) return
      editorStore.setMode(EDITOR_MODE.regular)
      const element = document.querySelector<HTMLDivElement>(id)
      rootStore.updateNode(selectedNodeId, {
        title: element?.innerText,
      })
    },
    [mode, selectedNodeId, editorStore],
  )

  useClickOutSide(
    id,
    (e) => {
      if (!selectedNodeId) return
      assert(e.target instanceof HTMLDivElement)
      const isTopic = e.target?.closest(`.${TOPIC_CLASS}`)
      if (isTopic) return
      editorStore.selectNode('')
    },
    [selectedNodeId, editorStore],
  )

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.stopPropagation()
      e.preventDefault()
      editorStore.setTranslate([
        translate[0] - e.deltaX,
        translate[1] - e.deltaY,
      ])
    },
    [translate, editorStore],
  )

  usePassiveWheelEvent(editorRef, handleWheel)

  // Select root topic after initial render
  useEffect(() => {
    setTimeout(() => {
      editorStore.selectNode(root.id)
    }, 200)
  }, [root.id])

  debug('rootStore', rootStore)

  const handleDragStart = useCallback(() => {
    setLastTouchPosition([0, 0])
    setIsDragging(true)
  }, [])

  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      editorStore.setTranslate([
        translate[0] + e.movementX,
        translate[1] + e.movementY,
      ])
    },
    [isDragging, translate, editorStore],
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
      editorStore.setTranslate([translate[0] + deltaX, translate[1] + deltaY])
      setLastTouchPosition([lastTouch.clientX, lastTouch.clientY])
    },
    [isDragging, lastTouchPosition, translate, editorStore],
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    setLastTouchPosition([0, 0])
  }, [])
  return (
    <div
      ref={editorRef}
      id={EDITOR_ID}
      className={styles.editorContainer}
      style={{
        fontFamily: TOPIC_FONT_FAMILY,
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
