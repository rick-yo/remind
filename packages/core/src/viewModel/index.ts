import { createContainer } from 'unstated-next'
import { useState } from 'preact/hooks'
import { EDITOR_MODE } from '../constant'
import { IViewModelStructure, IViewModelTrait } from '../interface/viewModel'
import { LayoutNode } from '../interface/topic'

export const defaultViewModel: IViewModelStructure = {
  mode: EDITOR_MODE.none,
  selection: '',
  mindMap: undefined,
  globalState: new Map(),
}

function useViewModel(
  initialState: IViewModelStructure = defaultViewModel,
): IViewModelStructure & IViewModelTrait {
  const [state, setState] = useState(initialState)
  function setMode(mode: EDITOR_MODE) {
    setState((previousState) => ({ ...previousState, mode }))
  }

  function select(selection: string) {
    setState((previousState) => ({ ...previousState, selection }))
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
    select,
    setMindmap,
    setGlobalState,
  }
}

const ViewModel = createContainer(useViewModel)

export { ViewModel }
