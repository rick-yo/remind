import { createContainer } from 'unstated-next'
import { useState } from 'preact/hooks'
import { LayoutTree } from '../utils/tree'
import { EDITOR_MODE } from '../constant'
import { LayoutNode } from '../types'

type IViewModel = {
  mode: EDITOR_MODE
  selectedNodeId: string
  scale: number
  readonly: boolean
  translate: [number, number]
}

export const defaultState: IViewModel = {
  mode: EDITOR_MODE.regular,
  selectedNodeId: '',
  scale: 1,
  readonly: false,
  translate: [0, 0],
}

function useViewModel(initialState: Partial<IViewModel> = {}) {
  const [state, setState] = useState({ ...defaultState, ...initialState })
  function setMode(mode: EDITOR_MODE) {
    if (state.readonly) return
    setState((previousState) => ({ ...previousState, mode }))
  }

  function selectNode(selectedNodeId: string) {
    setState((previousState) => ({ ...previousState, selectedNodeId }))
  }

  function setScale(scale: number) {
    setState((previousState) => ({ ...previousState, scale }))
  }

  function setTranslate(translate: [number, number]) {
    setState((previousState) => ({ ...previousState, translate }))
  }

  function moveLeft(rootWithCoords: LayoutNode) {
    const target = LayoutTree.from(rootWithCoords).getLeftNode(
      state.selectedNodeId,
    )
    if (target) {
      setState((previousState) => ({
        ...previousState,
        selectedNodeId: target.data.id,
      }))
    }
  }

  function moveRight(rootWithCoords: LayoutNode) {
    const target = LayoutTree.from(rootWithCoords).getRighttNode(
      state.selectedNodeId,
    )
    if (target) {
      setState((previousState) => ({
        ...previousState,
        selectedNodeId: target.data.id,
      }))
    }
  }

  function moveTop(rootWithCoords: LayoutNode) {
    const target = LayoutTree.from(rootWithCoords).getTopNode(
      state.selectedNodeId,
    )
    if (target) {
      setState((previousState) => ({
        ...previousState,
        selectedNodeId: target.data.id,
      }))
    }
  }

  function moveDown(rootWithCoords: LayoutNode) {
    const target = LayoutTree.from(rootWithCoords).getBottomNode(
      state.selectedNodeId,
    )
    if (target) {
      setState((previousState) => ({
        ...previousState,
        selectedNodeId: target.data.id,
      }))
    }
  }

  return {
    ...state,
    setMode,
    selectNode,
    setScale,
    setTranslate,
    moveLeft,
    moveRight,
    moveTop,
    moveDown,
  }
}

const ViewModel = createContainer(useViewModel)

export { ViewModel }
export type { IViewModel }
