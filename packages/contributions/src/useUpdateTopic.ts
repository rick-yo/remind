import hotkeys from 'hotkeys-js'
import {
  Contribution,
  types,
  assert,
  useEventListener,
  useEffect,
  createTopic,
  EDITOR_MODE,
} from 'remind-core'
import { HOTKEYS, KEY_MAPS, selectText } from './utils'

const useUpdateTopic: Contribution = (api) => {
  const { model, viewModel, view, locale } = api
  const { mode, selection } = viewModel
  const hotkeyOptions = {
    element: view.current,
  }

  function isTopicEditing(
    target: EventTarget | null,
  ): target is HTMLDivElement {
    return types.isTopic(target) && viewModel.mode === EDITOR_MODE.edit
  }

  function editTopicOnClick(e: MouseEvent) {
    if (types.isTopic(e.target)) {
      doEditTopic(e.target)
    }
  }

  function editTopicOnShortcut(e: KeyboardEvent) {
    e.preventDefault()
    if (!selection) return
    const element = types.getTopicElementById(selection)
    assert(element instanceof HTMLDivElement)
    doEditTopic(element)
  }

  function doEditTopic(element: HTMLDivElement) {
    element?.focus()
    selectText(element)
    viewModel.setMode(EDITOR_MODE.edit)
  }

  // PreventDefault to prevent enter keyboard event create new html element
  function handleKeyDown(e: KeyboardEvent) {
    if (isTopicEditing(e.target) && [KEY_MAPS.Enter].includes(e.key)) {
      e.preventDefault()
    }
  }

  function commitEditByShortcut(e: KeyboardEvent) {
    if (
      isTopicEditing(e.target) &&
      [KEY_MAPS.Enter, KEY_MAPS.Escape].includes(e.key)
    ) {
      doCommitEdit(e.target.textContent)
      // Fix selection exit after exit edit mode on firefox
      getSelection()?.removeAllRanges()
    }
  }

  function commitEditByClickAway(e: MouseEvent) {
    if (mode === EDITOR_MODE.edit || types.getTopicId(e.target) !== selection) {
      const element = types.getTopicElementById(selection)
      assert(element?.textContent)
      doCommitEdit(element.textContent)
    }
  }

  function doCommitEdit(textContent: string | null) {
    viewModel.setMode(EDITOR_MODE.none)
    model.update(() => {
      model.updateNode(selection, {
        title: textContent ?? '',
      })
    })
  }

  // Regular mode
  function appendChild(e: KeyboardEvent) {
    e.preventDefault()
    if (!selection) return
    model.update(() => {
      model.appendChild(selection, createTopic(locale.subTopic))
    })
  }

  function deleteNode() {
    model.update(() => {
      model.deleteNode(selection)
    })
  }

  useEffect(() => {
    if (mode === EDITOR_MODE.none) {
      hotkeys(HOTKEYS.tab, hotkeyOptions, appendChild)
      hotkeys(HOTKEYS.space, hotkeyOptions, editTopicOnShortcut)
      hotkeys(HOTKEYS.backspace, hotkeyOptions, deleteNode)
    }

    return () => {
      hotkeys.unbind(HOTKEYS.tab, appendChild)
      hotkeys.unbind(HOTKEYS.space, editTopicOnShortcut)
      hotkeys.unbind(HOTKEYS.backspace, deleteNode)
    }
  }, [mode, hotkeyOptions, appendChild, editTopicOnShortcut, deleteNode])

  useEventListener('dblclick', editTopicOnClick, {
    target: view,
  })
  useEventListener('keyup', commitEditByShortcut, {
    target: view,
  })
  useEventListener('keydown', handleKeyDown, {
    target: view,
  })
  // Edit mode
  useEventListener('click', commitEditByClickAway, {
    target: view,
  })
}

export { useUpdateTopic }
