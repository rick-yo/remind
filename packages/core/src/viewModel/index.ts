import { useState } from 'preact/hooks'
import { createContainer } from '../unstated'
import { EDITOR_MODE } from '../constant'
import { IViewModelStructure, IViewModelTrait } from '../interface/viewModel'
import { LayoutNode } from '../interface/topic'

export const defaultViewModel: IViewModelStructure = {
  mode: EDITOR_MODE.none,
  selection: '',
  selections: [],
  layoutRoot: undefined,
  globalState: new Map(),
}

function useViewModel(
  initialState: IViewModelStructure = defaultViewModel,
): IViewModelStructure & IViewModelTrait {
  const [state, setState] = useState(initialState)

  function setMode(mode: EDITOR_MODE) {
    setState((previousState) => ({ ...previousState, mode }))
  }

  function select(ids: string | string[]) {
    if (Array.isArray(ids)) {
      const [selection = ''] = ids
      setState((previousState) => ({
        ...previousState,
        selections: ids,
        selection,
      }))
    } else {
      setState((previousState) => ({
        ...previousState,
        selections: [ids],
        selection: ids,
      }))
    }
  }

  function setLayoutRoot(layoutRoot: LayoutNode) {
    setState((previousState) => ({ ...previousState, layoutRoot }))
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
    setLayoutRoot,
    setGlobalState,
  }
}

const ViewModel = createContainer(useViewModel)

export { ViewModel }
