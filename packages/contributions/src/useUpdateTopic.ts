import hotkeys from 'hotkeys-js'
import {
  Contribution,
  types,
  useEventListener,
  useEffect,
  createTopic,
  EDITOR_MODE,
} from 'remind-core'
import { HOTKEYS, KEY_MAPS } from './utils'

const useUpdateTopic: Contribution = (api) => {
  const { model, viewModel, view, locale, textEditor } = api
  const { mode, selection } = viewModel
  const hotkeyOptions = {
    element: view.current,
  }
  const isEditing = selection && mode === EDITOR_MODE.edit

  function editTopicOnClick(e: MouseEvent) {
    doEditTopic(e.target)
  }

  function editTopicOnShortcut(e: KeyboardEvent) {
    e.preventDefault()
    if (!selection) return
    const element = types.getTopicElementById(selection)
    doEditTopic(element)
  }

  function doEditTopic(element: EventTarget | null) {
    const id = types.getTopicId(element)
    if (id) {
      textEditor.editTopic(id)
    }
  }

  function commitEditByShortcut(e: KeyboardEvent) {
    if (isEditing && [KEY_MAPS.Enter, KEY_MAPS.Escape].includes(e.key)) {
      textEditor.commitEdit()
    }
  }

  function commitEditByClickAway(e: MouseEvent) {
    if (mode === EDITOR_MODE.edit || types.getTopicId(e.target) !== selection) {
      textEditor.commitEdit()
    }
  }

  // Regular mode
  function appendChild(e: KeyboardEvent) {
    e.preventDefault()
    if (!selection) return
    const child = createTopic(locale.subTopic)
    model.update(() => {
      model.appendChild(selection, child)
    })
    viewModel.select(child.id)
  }

  function deleteNode() {
    const nextSibling = model.getNextSibling(selection)
    const previousSibling = model.getPreviousSibling(selection)
    const parentNode = model.getParentNodeById(selection)
    model.update(() => {
      model.deleteNode(selection)
    })
    viewModel.select(
      previousSibling?.id ?? nextSibling?.id ?? parentNode?.id ?? '',
    )
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
  // Edit mode
  useEventListener('click', commitEditByClickAway, {
    target: view,
  })
}

export { useUpdateTopic }
