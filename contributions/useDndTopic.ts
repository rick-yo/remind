import { useState } from 'preact/hooks'
import { Contribution, types } from '../src/contribute'
import { assert } from '../src/utils/assert'
import { TopicTree } from '../src/utils/tree'
import { useEventListener } from '../src/utils/useEventListener'

const useDndTopic: Contribution = (api) => {
  const { model, view } = api
  const { root } = model
  const [dragNode, setDragNode] = useState<string | null>(null)

  function handleDragStart(e: DragEvent) {
    const id = types.getTopicId(e.target)
    // Root node is not draggable
    if (!id || id === root.id) {
      e.preventDefault()
      return
    }

    assert(e.dataTransfer instanceof HTMLDivElement)
    // SetData dataTransfer to make drag and drop work in firefox
    e.dataTransfer.setData('text/plain', '')
    setDragNode(id)
  }

  function handleDrop(e: DragEvent) {
    const id = types.getTopicId(e.target)
    if (!dragNode || !id) return
    if (dragNode === id) return
    const node = TopicTree.from(root).getNodeById(id)
    assert(node)
    // Should not drop topic to it's descendants
    const descendants = node?.descendants()
    if (descendants?.some((node) => node.data.id === id)) {
      return
    }

    model.appendChild(id, node?.data)
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
