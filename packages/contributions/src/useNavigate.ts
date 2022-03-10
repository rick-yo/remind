import hotkeys from 'hotkeys-js'
import { Contribution, useEffect, EDITOR_MODE, LayoutNode } from 'remind-core'
import { HOTKEYS, LayoutTreeWalker } from './utils'

const navigatorStrategy = {
  mindmap: {
    left: (root: LayoutNode, id: string) =>
      LayoutTreeWalker.from(root).getParentNode(id),
    right: (root: LayoutNode, id: string) =>
      LayoutTreeWalker.from(root).getNearestChildNode(id),
    top: (root: LayoutNode, id: string) =>
      LayoutTreeWalker.from(root).getNearestTopNode(id),
    bottom: (root: LayoutNode, id: string) =>
      LayoutTreeWalker.from(root).getNearestBottomNode(id),
  },
  structure: {
    left: (root: LayoutNode, id: string) =>
      LayoutTreeWalker.from(root).getLeftNeighborNode(id),
    right: (root: LayoutNode, id: string) =>
      LayoutTreeWalker.from(root).getRightNeighborNode(id),
    top: (root: LayoutNode, id: string) =>
      LayoutTreeWalker.from(root).getParentNode(id),
    bottom: (root: LayoutNode, id: string) =>
      LayoutTreeWalker.from(root).getNearestChildNode(id),
  },
}

const useNavigate: Contribution = (api) => {
  const { viewModel, view, layout } = api
  const { selection, mode, layoutRoot } = viewModel
  const hotkeyOptions = {
    element: view.current,
  }
  const navigate = navigatorStrategy[layout]

  function moveTop(e: KeyboardEvent) {
    e.preventDefault()
    if (!layoutRoot) return
    const target = navigate.top(layoutRoot, selection)
    if (target) {
      viewModel.select(target.data.id)
    }
  }

  function moveDown(e: KeyboardEvent) {
    e.preventDefault()
    if (!layoutRoot) return
    const target = navigate.bottom(layoutRoot, selection)
    if (target) {
      viewModel.select(target.data.id)
    }
  }

  function moveLeft(e: KeyboardEvent) {
    e.preventDefault()
    if (!layoutRoot) return
    const target = navigate.left(layoutRoot, selection)
    if (target) {
      viewModel.select(target.data.id)
    }
  }

  function moveRight(e: KeyboardEvent) {
    e.preventDefault()
    if (!layoutRoot) return
    const target = navigate.right(layoutRoot, selection)
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
