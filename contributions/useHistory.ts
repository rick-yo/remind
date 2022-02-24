import hotkeys from 'hotkeys-js'
import { useEffect } from 'preact/hooks'
import { EDITOR_MODE, HOTKEYS } from '../src/constant'
import { Contribution } from '../src/contribute'

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

    if (mode === EDITOR_MODE.regular) {
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
