import { createContainer } from 'unstated-next'
import { useState } from 'preact/hooks'
import { EDITOR_MODE } from '../constant'
import { LayoutNode } from '../types'

type IViewModel = {
  mode: EDITOR_MODE
  selectedNodeId: string
  mindMap?: LayoutNode
  globalState: Map<string, any>
}

export const defaultViewModel: IViewModel = {
  mode: EDITOR_MODE.regular,
  selectedNodeId: '',
  mindMap: undefined,
  globalState: new Map(),
}

function useViewModel(initialState: IViewModel = defaultViewModel) {
  const [state, setState] = useState(initialState)
  function setMode(mode: EDITOR_MODE) {
    setState((previousState) => ({ ...previousState, mode }))
  }

  function selectNode(selectedNodeId: string) {
    setState((previousState) => ({ ...previousState, selectedNodeId }))
  }

  function setMindmap(mindMap: LayoutNode) {
    setState((previousState) => ({ ...previousState, mindMap }))
  }

  function setGlobalState(key: string, value: any) {
    setState((previousState) => {
      previousState.globalState.set(key, value)
      return previousState
    })
  }

  return {
    ...state,
    setMode,
    selectNode,
    setMindmap,
    setGlobalState,
  }
}

const ViewModel = createContainer(useViewModel)

export { ViewModel }
export type { IViewModel }
