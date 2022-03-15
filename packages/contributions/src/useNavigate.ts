import hotkeys from 'hotkeys-js'
import {
  Contribution,
  useEffect,
  EDITOR_MODE,
  LayoutTopic,
  TopicData,
  LayoutType,
} from 'remind-core'
import { HOTKEYS, LayoutTreeWalker } from './utils'

type Navigator = (
  root: LayoutTopic,
  id: string,
  justify: TopicData['justify'],
) => LayoutTopic | undefined

interface Navigators {
  left: Navigator
  right: Navigator
  top: Navigator
  bottom: Navigator
}

const navigatorStrategy: Record<LayoutType, Navigators> = {
  mindmap: {
    left(root: LayoutTopic, id: string, justify: TopicData['justify']) {
      const layoutRoot = LayoutTreeWalker.from(root)
      if (id === root.data.id) return layoutRoot.getNearestLeftNode(id)
      if (justify === 'start') return layoutRoot.getNearestChildNode(id)
      return layoutRoot.getParentNode(id)
    },
    right(root: LayoutTopic, id: string, justify: TopicData['justify']) {
      const layoutRoot = LayoutTreeWalker.from(root)
      if (id === root.data.id) return layoutRoot.getNearestRightNode(id)
      if (justify === 'start') return layoutRoot.getParentNode(id)
      return layoutRoot.getNearestChildNode(id)
    },
    top: (root: LayoutTopic, id: string) =>
      LayoutTreeWalker.from(root).getNearestTopNode(id),
    bottom: (root: LayoutTopic, id: string) =>
      LayoutTreeWalker.from(root).getNearestBottomNode(id),
  },
  structure: {
    left: (root: LayoutTopic, id: string) =>
      LayoutTreeWalker.from(root).getLeftNeighborNode(id),
    right: (root: LayoutTopic, id: string) =>
      LayoutTreeWalker.from(root).getRightNeighborNode(id),
    top: (root: LayoutTopic, id: string) =>
      LayoutTreeWalker.from(root).getParentNode(id),
    bottom: (root: LayoutTopic, id: string) =>
      LayoutTreeWalker.from(root).getNearestChildNode(id),
  },
}

const useNavigate: Contribution = (api) => {
  const { model, viewModel, view, layout } = api
  const { selection, mode, layoutRoot } = viewModel
  const hotkeyOptions = {
    element: view.current,
  }
  const navigate = navigatorStrategy[layout]

  function moveTop(e: KeyboardEvent) {
    e.preventDefault()
    if (!layoutRoot) return
    const target = navigate.top(
      layoutRoot,
      selection,
      model.getNodeJustify(selection),
    )
    if (target) {
      viewModel.select(target.data.id)
    }
  }

  function moveDown(e: KeyboardEvent) {
    e.preventDefault()
    if (!layoutRoot) return
    const target = navigate.bottom(
      layoutRoot,
      selection,
      model.getNodeJustify(selection),
    )
    if (target) {
      viewModel.select(target.data.id)
    }
  }

  function moveLeft(e: KeyboardEvent) {
    e.preventDefault()
    if (!layoutRoot) return
    const target = navigate.left(
      layoutRoot,
      selection,
      model.getNodeJustify(selection),
    )
    if (target) {
      viewModel.select(target.data.id)
    }
  }

  function moveRight(e: KeyboardEvent) {
    e.preventDefault()
    if (!layoutRoot) return
    const target = navigate.right(
      layoutRoot,
      selection,
      model.getNodeJustify(selection),
    )
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
