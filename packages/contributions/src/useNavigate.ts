import hotkeys from 'hotkeys-js'
import { Contribution, useEffect, EDITOR_MODE } from 'remind-core'
import { HOTKEYS, LayoutTree } from './utils'

const useNavigate: Contribution = (api) => {
  const { viewModel, view } = api
  const { selection, mode, layoutRoot } = viewModel
  const hotkeyOptions = {
    element: view.current,
  }

  function moveTop(e: KeyboardEvent) {
    e.preventDefault()
    if (!layoutRoot) return
    const target = LayoutTree.from(layoutRoot).getTopNode(selection)
    if (target) {
      viewModel.select(target.data.id)
    }
  }

  function moveDown(e: KeyboardEvent) {
    e.preventDefault()
    if (!layoutRoot) return
    const target = LayoutTree.from(layoutRoot).getBottomNode(selection)
    if (target) {
      viewModel.select(target.data.id)
    }
  }

  function moveLeft(e: KeyboardEvent) {
    e.preventDefault()
    if (!layoutRoot) return
    const target = LayoutTree.from(layoutRoot).getLeftNode(selection)
    if (target) {
      viewModel.select(target.data.id)
    }
  }

  function moveRight(e: KeyboardEvent) {
    e.preventDefault()
    if (!layoutRoot) return
    const target = LayoutTree.from(layoutRoot).getRighttNode(selection)
    if (target) {
      viewModel.select(target.data.id)
    }
  }

  // Regular mode, bind navigate shortcut
  useEffect(() => {
    if (mode === EDITOR_MODE.none) {
      hotkeys(HOTKEYS.left, hotkeyOptions, moveLeft)
      hotkeys(HOTKEYS.right, hotkeyOptions, moveRight)
      hotkeys(HOTKEYS.up, hotkeyOptions, moveTop)
      hotkeys(HOTKEYS.down, hotkeyOptions, moveDown)
    }

    return () => {
      hotkeys.unbind(HOTKEYS.left, moveLeft)
      hotkeys.unbind(HOTKEYS.right, moveRight)
      hotkeys.unbind(HOTKEYS.up, moveTop)
      hotkeys.unbind(HOTKEYS.down, moveDown)
    }
  }, [layoutRoot, hotkeyOptions, mode, viewModel])
}

export { useNavigate }
