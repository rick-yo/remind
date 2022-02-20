import { createContainer } from 'unstated-next'
import { useState } from 'preact/hooks'
import {
  getLeftNode,
  HierachyNodeWithTopicData,
  getRighttNode,
  getTopNode,
  getBottomNode,
} from '../utils/tree'
import { EDITOR_MODE } from '../constant'
import { TopicData } from '../types'

type IState = {
  mode: EDITOR_MODE
  selectedNodeId: string
  scale: number
  dragingNode?: TopicData
  readonly: boolean
  translate: [number, number]
}

export const defaultState: IState = {
  mode: EDITOR_MODE.regular,
  selectedNodeId: '',
  scale: 1,
  dragingNode: undefined,
  readonly: false,
  translate: [0, 0],
}

function useEditor(initialState: Partial<IState> = {}) {
  const [state, setState] = useState({ ...defaultState, ...initialState })
  function SET_MODE(mode: EDITOR_MODE) {
    if (state.readonly) return
    setState((previousState) => ({ ...previousState, mode }))
  }

  function SELECT_NODE(selectedNodeId: string) {
    setState((previousState) => ({ ...previousState, selectedNodeId }))
  }

  function DRAG_NODE(payload: TopicData) {
    // Remove TopicData's depth、side
    const { side, depth, ...dragingNode } = payload
    setState((previousState) => ({ ...previousState, dragingNode }))
  }

  function SET_SCALE(scale: number) {
    setState((previousState) => ({ ...previousState, scale }))
  }

  function SET_TRANSLATE(translate: [number, number]) {
    setState((previousState) => ({ ...previousState, translate }))
  }

  function MOVE_LEFT(rootWithCoords: HierachyNodeWithTopicData) {
    const target = getLeftNode(rootWithCoords, state.selectedNodeId)
    if (target) {
      setState((previousState) => ({
        ...previousState,
        selectedNodeId: target.data.id,
      }))
    }
  }

  function MOVE_RIGHT(rootWithCoords: HierachyNodeWithTopicData) {
    const target = getRighttNode(rootWithCoords, state.selectedNodeId)
    if (target) {
      setState((previousState) => ({
        ...previousState,
        selectedNodeId: target.data.id,
      }))
    }
  }

  function MOVE_TOP(rootWithCoords: HierachyNodeWithTopicData) {
    const target = getTopNode(rootWithCoords, state.selectedNodeId)
    if (target) {
      setState((previousState) => ({
        ...previousState,
        selectedNodeId: target.data.id,
      }))
    }
  }

  function MOVE_DOWN(rootWithCoords: HierachyNodeWithTopicData) {
    const target = getBottomNode(rootWithCoords, state.selectedNodeId)
    if (target) {
      setState((previousState) => ({
        ...previousState,
        selectedNodeId: target.data.id,
      }))
    }
  }

  return {
    ...state,
    SET_MODE,
    SELECT_NODE,
    DRAG_NODE,
    SET_SCALE,
    SET_TRANSLATE,
    MOVE_LEFT,
    MOVE_RIGHT,
    MOVE_TOP,
    MOVE_DOWN,
  }
}

const EditorStore = createContainer(useEditor)

export default EditorStore
