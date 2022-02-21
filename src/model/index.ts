import { createContainer } from 'unstated-next'
import { useEffect, useState } from 'preact/hooks'
import {
  normalizeTopicSide,
  createTopic,
  removeChild,
  TopicTree,
} from '../utils/tree'
import { MindmapProps, TopicData } from '../types'
import { History } from '../utils/history'
import { deepClone } from '../utils/common'
import { ViewModel } from '../viewModel'

interface IState {
  root: TopicData
  onChange?: MindmapProps['onChange']
  readonly: boolean
}

const defaultRoot: TopicData = normalizeTopicSide({
  ...createTopic('Central Topic'),
  children: [createTopic('main topic 1'), createTopic('main topic 2')],
})

export const defaultState: IState = {
  root: defaultRoot,
  readonly: false,
}

function useModel(initialState: Partial<IState> = {}) {
  const [state, setState] = useState({ ...defaultState, ...initialState })
  const viewModel = ViewModel.useContainer()
  const history = new History<TopicData>()

  const pushSync = (newRoot: TopicData): TopicData => {
    return history.pushSync(deepClone(newRoot)).get()
  }

  useEffect(() => {
    state.onChange?.(state.root)
  }, [state])

  return {
    ...state,
    appendChild(parentId: string, node: TopicData) {
      if (state.readonly) return
      const root = pushSync(state.root)
      const rootTopic = TopicTree.from(root)
      const isNodeConnected = rootTopic.getNodeById(node.id)
      // If node already exist in node tree, delete it from it's old parent first
      if (isNodeConnected) {
        const previousParentNode = rootTopic.getNodeById(node.id)?.parent?.data
        if (previousParentNode) {
          removeChild(previousParentNode, node.id)
        }
      }

      const parentNode = rootTopic.getNodeById(parentId)?.data
      if (!parentNode) return
      parentNode.children = parentNode.children ?? []
      if (parentNode === root) {
        const leftNodes = parentNode.children.filter(
          (node) => node.side === 'left',
        )
        node.side =
          parentNode.children.length / 2 > leftNodes.length ? 'left' : 'right'
      }

      parentNode.children = parentNode.children || []
      parentNode.children.push(node)
      setState({ ...state, root })
    },
    deleteNode(id: string) {
      if (!id) return
      if (state.readonly) return
      const root = pushSync(state.root)
      const rootTopic = TopicTree.from(root)
      const parentNode = rootTopic.getNodeById(id)?.parent?.data
      if (parentNode?.children) {
        // When deleted a node, select deleted node's sibing or parent
        const sibling =
          rootTopic.getPreviousNode(id) ?? rootTopic.getNextNode(id)
        removeChild(parentNode, id)
        const selectedNode = sibling ?? parentNode
        viewModel.selectNode(selectedNode.id)
      }

      setState({ ...state, root })
    },
    updateNode(id: string, node: Partial<TopicData>) {
      if (!id) return
      if (state.readonly) return
      const root = pushSync(state.root)
      const rootTopic = TopicTree.from(root)
      const currentNode = rootTopic.getNodeById(id)
      if (currentNode) {
        Object.assign(currentNode, node)
      }

      setState({ ...state, root })
    },
    undo() {
      setState((previousState) => ({
        ...previousState,
        root: history.undo().get(),
      }))
    },
    redo() {
      setState((previousState) => ({
        ...previousState,
        root: history.redo().get(),
      }))
    },
  }
}

const Model = createContainer(useModel)

export { defaultRoot, Model }
