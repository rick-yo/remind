import { Contribution, types } from '../src/contribute'
import { assert } from '../src/utils/assert'
import { TopicTree } from '../src/utils/tree'
import { useEventListener } from '../src/utils/useEventListener'

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
    if (!fromId || !toId) return
    const fromNode = TopicTree.from(root).getNodeById(fromId)
    assert(fromNode)
    // Should not drop topic to it's descendants
    if (fromNode.descendants().some((node) => node.data.id === toId)) {
      return
    }

    model.appendChild(toId, fromNode?.data)
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
