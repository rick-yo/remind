import { createContainer } from 'unstated-next'
import { useEffect, useState } from 'preact/hooks'
import {
  topicWalker,
  normalizeTopicSide,
  createTopic,
  removeChild,
} from '../utils/tree'
import { MindmapProps } from '../index'
import { TopicData } from '../types'
import EditorStore from './editor'

interface IState {
  timeline: TopicData[]
  current: number
  onChange?: MindmapProps['onChange']
  readonly: boolean
}

const UNDO_HISTORY = 'UNDO_HISTORY'
const REDO_HISTORY = 'REDO_HISTORY'
// Const SAVE_HISTORY = 'SAVE_HISTORY';
const APPEND_CHILD = 'APPEND_CHILD'
const DELETE_NODE = 'DELETE_NODE'
const UPDATE_NODE = 'UPDATE_NODE'

const defaultRoot: TopicData = normalizeTopicSide({
  ...createTopic('Central Topic'),
  children: [createTopic('main topic 1'), createTopic('main topic 2')],
})

export const defaultState: IState = {
  current: 0,
  timeline: [defaultRoot],
  readonly: false,
}

function useRoot(initialState: Partial<IState> = {}) {
  const [state, setState] = useState({ ...defaultState, ...initialState })
  const editorStore = EditorStore.useContainer()

  const SAVE_HISTORY = (draftState: IState, lastRoot: TopicData): IState => {
    const { timeline, current } = draftState
    const nextTimeline = timeline.slice(0, current + 1)
    nextTimeline.push(lastRoot)
    return {
      ...draftState,
      timeline: nextTimeline,
      current: nextTimeline.length - 1,
    }
  }

  useEffect(() => {
    state.onChange?.(getClonedRoot(state))
  }, [state])

  return {
    ...state,
    [APPEND_CHILD](parentId: string, node: TopicData) {
      if (state.readonly) return
      const lastRoot = getClonedRoot(state)
      const nextState = SAVE_HISTORY(state, lastRoot)
      const root = nextState.timeline[nextState.current]
      const isNodeConnected = topicWalker.getNode(root, node.id)
      // If node already exist in node tree, delete it from it's old parent first
      if (isNodeConnected) {
        const previousParentNode = topicWalker.getParentNode(root, node.id)
        if (previousParentNode) {
          removeChild(previousParentNode, node.id)
        }
      }

      const parentNode = topicWalker.getNode(root, parentId)
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
      setState(nextState)
    },
    [DELETE_NODE](id: string) {
      if (!id) return
      if (state.readonly) return
      const lastRoot = getClonedRoot(state)
      const nextState = SAVE_HISTORY(state, lastRoot)
      const root = nextState.timeline[nextState.current]
      const parentNode = topicWalker.getParentNode(root, id)
      if (parentNode?.children) {
        // When deleted a node, select deleted node's sibing or parent
        const sibling =
          topicWalker.getPreviousNode(root, id) ??
          topicWalker.getNextNode(root, id)
        removeChild(parentNode, id)
        const selectedNode = sibling ?? parentNode
        editorStore.SELECT_NODE(selectedNode.id)
      }

      setState(nextState)
    },
    [UPDATE_NODE](id: string, node: Partial<TopicData>) {
      if (!id) return
      if (state.readonly) return
      const lastRoot = getClonedRoot(state)
      const nextState = SAVE_HISTORY(state, lastRoot)
      const root = nextState.timeline[nextState.current]
      const currentNode = topicWalker.getNode(root, id)
      if (currentNode) {
        Object.assign(currentNode, node)
      }
      setState(nextState)
    },
    [UNDO_HISTORY]() {
      setState((previousState) => ({
        ...previousState,
        current: Math.max(0, previousState.current - 1),
      }))
    },
    [REDO_HISTORY]() {
      setState((previousState) => ({
        ...previousState,
        current: Math.min(
          previousState.timeline.length - 1,
          previousState.current + 1,
        ),
      }))
    },
  }
}

function getClonedRoot(state: IState) {
  return JSON.parse(JSON.stringify(state.timeline[state.current])) as TopicData
}

const RootStore = createContainer(useRoot)

const RootStoreProvider = RootStore.Provider

const useRootSelector = <T>(selector: (state: TopicData) => T) => {
  const rootState = RootStore.useContainer()
  return selector(rootState.timeline[rootState.current])
}

export { defaultRoot, RootStoreProvider, RootStore, useRootSelector }
