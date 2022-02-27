import { createContainer } from 'unstated-next'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { createTopic, removeChild, TopicTree } from '../utils/tree'
import { History } from '../utils/history'
import { deepClone } from '../utils/common'
import { TopicData } from '../interface/topic'
import { IModelStructure, IModelTrait } from '../interface/model'
import { assert } from '../utils/assert'

const updateTip =
  'Do not update model outside of update function, and updater should be sync'

const defaultRoot: TopicData = {
  ...createTopic('Central Topic'),
  children: [createTopic('main topic 1'), createTopic('main topic 2')],
}
const defaultModel: IModelStructure = {
  root: defaultRoot,
}

function useModel(
  initialState: IModelStructure = defaultModel,
): IModelStructure & IModelTrait {
  const [state, __internalSetState] = useState(initialState)
  const history = useMemo(() => {
    return new History<IModelStructure>()
  }, [])
  const nextStateRef = useRef<IModelStructure | null>(null)

  useEffect(() => {
    update(() => {
      // Nothing
    })
  }, [])

  function syncHistoryState() {
    __internalSetState(history.get())
  }

  useEffect(() => {
    history.addEventListener(History.EventTypes.change, syncHistoryState)
    return () => {
      history.removeEventListener(History.EventTypes.change, syncHistoryState)
    }
  }, [history])

  const update = (updater: (root: IModelStructure) => void): void => {
    assert(
      nextStateRef.current === null,
      'Do not call update inside an updater',
    )
    nextStateRef.current = deepClone(state)
    updater(nextStateRef.current)
    history.pushSync(nextStateRef.current)
    nextStateRef.current = null
  }

  function appendChild(parentId: string, node: TopicData) {
    const root = nextStateRef.current?.root
    assert(root, updateTip)
    const rootTopic = TopicTree.from(root)
    const isNodeConnected = rootTopic.getNodeById(node.id)
    // If node already exist in node tree, delete it from it's old parent first
    if (isNodeConnected) {
      const previousParentNode = rootTopic.getParentNode(node.id)
      if (previousParentNode) {
        removeChild(previousParentNode, node.id)
      }
    }

    const parentNode = rootTopic.getNodeById(parentId)?.data
    if (!parentNode) return
    parentNode.children = parentNode.children ?? []
    parentNode.children = parentNode.children || []
    parentNode.children.push(node)
  }

  function deleteNode(id: string) {
    if (!id) return
    const root = nextStateRef.current?.root
    assert(root, updateTip)
    const rootTopic = TopicTree.from(root)
    const parentNode = rootTopic.getParentNode(id)
    if (parentNode?.children) {
      removeChild(parentNode, id)
    }
  }

  function updateNode(id: string, node: Partial<TopicData>) {
    if (!id) return
    const root = nextStateRef.current?.root
    assert(root, updateTip)
    const rootTopic = TopicTree.from(root)
    const currentNode = rootTopic.getNodeById(id)
    if (currentNode) {
      Object.assign(currentNode.data, node)
    }
  }

  function undo() {
    history.undo()
  }

  function redo() {
    history.redo()
  }

  return {
    ...state,
    appendChild,
    deleteNode,
    updateNode,
    undo,
    redo,
    update,
  }
}

const Model = createContainer(useModel)

export { defaultRoot, Model }
