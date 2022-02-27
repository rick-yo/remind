import hotkeys from 'hotkeys-js'
import { Contribution, useEffect, EDITOR_MODE } from 'remind-core'
import { HOTKEYS } from './utils'

const useHistory: Contribution = (api) => {
  const { model, viewModel, view } = api
  const { mode } = viewModel
  const hotkeyOptions = {
    element: view.current,
  }

  // Regular mode, bind undo redo shortcut
  useEffect(() => {
    function undo() {
      model.undo()
    }

    function redo() {
      model.redo()
    }

    if (mode === EDITOR_MODE.none) {
      hotkeys(HOTKEYS.undo, hotkeyOptions, undo)
      hotkeys(HOTKEYS.redo, hotkeyOptions, redo)
    }

    return () => {
      hotkeys.unbind(HOTKEYS.undo, undo)
      hotkeys.unbind(HOTKEYS.redo, redo)
    }
  }, [hotkeyOptions, mode, model])
}

export { useHistory }
