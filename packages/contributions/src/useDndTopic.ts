import { Contribution, types, assert, useEventListener } from 'remind-core'

const dndDataFormat = 'text/plain'

const useDndTopic: Contribution = (api) => {
  const { model, view } = api
  const { root } = model

  function handleDragStart(e: DragEvent) {
    const id = types.getTopicId(e.target)
    // Root node is not draggable
    if (!id || id === root.id) {
      e.preventDefault()
      return
    }

    // SetData dataTransfer to make drag and drop work in firefox
    e.dataTransfer?.setData(dndDataFormat, id)
  }

  function handleDrop(e: DragEvent) {
    const fromId = e.dataTransfer?.getData(dndDataFormat)
    const toId = types.getTopicId(e.target)
    if (!fromId || !toId || fromId === toId) return
    const fromNode = model.getNodeById(fromId)
    assert(fromNode)
    // Should not drop topic to it's descendants
    if (fromNode.children?.some((node) => node.id === toId)) {
      return
    }

    model.update(() => {
      // If node already exist in node tree, delete it from it's old parent first
      model.deleteNode(fromId)
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

  useEventListener('dragstart', handleDragStart, {
    target: view,
  })
  useEventListener('dragover', handleDragOver, {
    target: view,
  })
  useEventListener('drop', handleDrop, {
    target: view,
  })
}

export { useDndTopic }
