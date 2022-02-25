import hotkeys from 'hotkeys-js'
import { useEffect } from 'preact/hooks'
import { EDITOR_MODE } from '../src/constant'
import { Contribution } from '../src/contribute'
import { HOTKEYS, LayoutTree } from './utils'

const useNavigate: Contribution = (api) => {
  const { viewModel, view } = api
  const { selectedNodeId, mode, mindMap } = viewModel
  const hotkeyOptions = {
    element: view.current,
  }

  function moveTop(e: KeyboardEvent) {
    e.preventDefault()
    if (!mindMap) return
    const target = LayoutTree.from(mindMap).getTopNode(selectedNodeId)
    if (target) {
      viewModel.selectNode(target.data.id)
    }
  }

  function moveDown(e: KeyboardEvent) {
    e.preventDefault()
    if (!mindMap) return
    const target = LayoutTree.from(mindMap).getBottomNode(selectedNodeId)
    if (target) {
      viewModel.selectNode(target.data.id)
    }
  }

  function moveLeft(e: KeyboardEvent) {
    e.preventDefault()
    if (!mindMap) return
    const target = LayoutTree.from(mindMap).getLeftNode(selectedNodeId)
    if (target) {
      viewModel.selectNode(target.data.id)
    }
  }

  function moveRight(e: KeyboardEvent) {
    e.preventDefault()
    if (!mindMap) return
    const target = LayoutTree.from(mindMap).getRighttNode(selectedNodeId)
    if (target) {
      viewModel.selectNode(target.data.id)
    }
  }

  // Regular mode, bind navigate shortcut
  useEffect(() => {
    if (mode === EDITOR_MODE.regular) {
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
