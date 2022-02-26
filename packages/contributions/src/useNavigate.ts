import hotkeys from 'hotkeys-js'
import { Contribution, useEffect, EDITOR_MODE } from 'remindjs-core'
import { HOTKEYS, LayoutTree } from './utils'

const useNavigate: Contribution = (api) => {
  const { viewModel, view } = api
  const { selection, mode, mindMap } = viewModel
  const hotkeyOptions = {
    element: view.current,
  }

  function moveTop(e: KeyboardEvent) {
    e.preventDefault()
    if (!mindMap) return
    const target = LayoutTree.from(mindMap).getTopNode(selection)
    if (target) {
      viewModel.select(target.data.id)
    }
  }

  function moveDown(e: KeyboardEvent) {
    e.preventDefault()
    if (!mindMap) return
    const target = LayoutTree.from(mindMap).getBottomNode(selection)
    if (target) {
      viewModel.select(target.data.id)
    }
  }

  function moveLeft(e: KeyboardEvent) {
    e.preventDefault()
    if (!mindMap) return
    const target = LayoutTree.from(mindMap).getLeftNode(selection)
    if (target) {
      viewModel.select(target.data.id)
    }
  }

  function moveRight(e: KeyboardEvent) {
    e.preventDefault()
    if (!mindMap) return
    const target = LayoutTree.from(mindMap).getRighttNode(selection)
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
  }, [mindMap, hotkeyOptions, mode, viewModel])
}

export { useNavigate }
