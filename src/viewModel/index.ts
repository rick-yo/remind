import { createContainer } from 'unstated-next'
import { useState } from 'preact/hooks'
import { EDITOR_MODE } from '../constant'
import { LayoutNode } from '../types'

type IViewModel = {
  mode: EDITOR_MODE
  selectedNodeId: string
  scale: number
  readonly: boolean
  mindMap?: LayoutNode
}

export const defaultState: IViewModel = {
  mode: EDITOR_MODE.regular,
  selectedNodeId: '',
  scale: 1,
  readonly: false,
  mindMap: undefined,
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

  function setMindmap(mindMap: LayoutNode) {
    setState((previousState) => ({ ...previousState, mindMap }))
  }

  return {
    ...state,
    setMode,
    selectNode,
    setScale,
    setMindmap,
  }
}

const ViewModel = createContainer(useViewModel)

export { ViewModel }
export type { IViewModel }
