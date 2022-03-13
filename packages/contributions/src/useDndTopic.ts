import {
  Contribution,
  types,
  assert,
  useEventListener,
  TopicData,
  useRef,
  useEffect,
} from 'remind-core'
import { CursorStyle, getRectImage } from './utils'

const dndDataFormat = 'text/plain'

const useDndTopic: Contribution = (api) => {
  const { model, view, viewModel } = api
  const { root } = model
  const fromRef = useRef<TopicData>()
  const dragImageRef = useRef<HTMLImageElement>()

  function handleDragStart(e: DragEvent) {
    const node = viewModel.hitTest(e.offsetX, e.offsetY)
    // Root node is not draggable
    if (!node || node.data.id === root.id) {
      e.preventDefault()
      return
    }

    assert(e.dataTransfer)
    fromRef.current = node.data
    e.dataTransfer.setDragImage(dragImageRef.current!, 10, 10)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.dropEffect = 'none'
    // setData dataTransfer to make drag and drop work in firefox
    e.dataTransfer.setData(dndDataFormat, '')
  }

  function isChild(toId: string) {
    return fromRef.current?.children?.some((node) => node.id === toId)
  }

  function handleDrop(e: DragEvent) {
    const fromNode = fromRef.current
    const toId = types.getTopicId(e.target)
    if (!fromNode || !toId || fromNode.id === toId) return
    assert(fromNode)
    // Should not drop topic to it's descendants
    if (isChild(toId)) {
      return
    }

    model.update(() => {
      // If node already exist in node tree, delete it from it's old parent first
      model.deleteNode(fromNode.id)
      model.appendChild(toId, fromNode)
    })
  }

  // We need to prevent the default behavior
  // of this event, in order for the onDrop
  // event to fire.
  // It may sound weird, but the default is
  // to cancel out the drop.
  function handleDragOver(e: DragEvent) {
    e.preventDefault()
  }

  function handleDrag(e: DragEvent) {
    e.preventDefault()
    const toNode = viewModel.hitTest(e.offsetX, e.offsetY)
    assert(e.dataTransfer)
    assert(view.current instanceof HTMLDivElement)
    if (fromRef.current && toNode?.data.id && !isChild(toNode.data.id)) {
      // set dropEffect seems has no effect on chrome
      e.dataTransfer.dropEffect = 'move'
      view.current.style.cursor = CursorStyle.copy
      console.log(view.current.style.cursor)
    } else {
      view.current.style.cursor = CursorStyle.notAllowed
    }
  }

  function handleDragEnd() {
    assert(view.current instanceof HTMLDivElement)
    fromRef.current = undefined
    view.current.style.cursor = CursorStyle.default
  }

  useEffect(() => {
    const img = getRectImage()
    img.style.position = 'absolute'
    img.style.left = '-10000px'
    dragImageRef.current = img
    return () => {
      dragImageRef.current?.remove()
    }
  }, [])

  useEventListener('dragstart', handleDragStart, {
    target: view,
  })
  useEventListener('drag', handleDrag, {
    target: view,
  })
  useEventListener('drop', handleDrop, {
    target: view,
  })
  useEventListener('dragover', handleDragOver, {
    target: view,
  })
  useEventListener('dragend', handleDragEnd, {
    target: view,
  })
}

export { useDndTopic }
