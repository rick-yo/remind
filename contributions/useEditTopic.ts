import hotkeys from 'hotkeys-js'
import { useEffect } from 'preact/hooks'
import { EDITOR_MODE } from '../src/constant'
import { Contribution, types } from '../src/contribute'
import { assert } from '../src/utils/assert'
import { createTopic } from '../src/utils/tree'
import { useEventListener } from '../src/utils/useEventListener'
import { HOTKEYS, KEY_MAPS, selectText } from './utils'

const useEditTopic: Contribution = (api) => {
  const { model, viewModel, view, locale } = api
  const { mode, selection } = viewModel
  const hotkeyOptions = {
    element: view.current,
  }

  function exitEditMode(e: KeyboardEvent) {
    if (!types.isTopic(e.target)) return
    if (
      [KEY_MAPS.Enter, KEY_MAPS.Escape].includes(e.key) &&
      viewModel.mode === EDITOR_MODE.edit
    ) {
      viewModel.setMode(EDITOR_MODE.none)
      assert(e.target instanceof HTMLDivElement)
      model.updateNode(viewModel.selection, {
        title: e.target.textContent ?? '',
      })
      // Fix selection exit after exit edit mode on firefox
      getSelection()?.removeAllRanges()
    }
  }

  function editTopic(e: MouseEvent) {
    const element = e.target as HTMLDivElement
    element?.focus()
    selectText(element)
    viewModel.setMode(EDITOR_MODE.edit)
  }

  // PreventDefault to prevent enter keyboard event create new html element
  function handleKeyDown(e: KeyboardEvent) {
    if (
      [KEY_MAPS.Enter].includes(e.key) &&
      viewModel.mode === EDITOR_MODE.edit
    ) {
      e.preventDefault()
    }
  }

  // Edit mode
  useEventListener('click', (e) => {
    if (!selection || mode !== EDITOR_MODE.edit || types.isTopic(e.target)) {
      return
    }

    assert(e.target instanceof HTMLDivElement)
    viewModel.setMode(EDITOR_MODE.none)
    model.updateNode(selection, {
      title: e.target?.innerText,
    })
  })
  // Regular mode
  function appendChild(e: KeyboardEvent) {
    e.preventDefault()
    if (!selection) return
    model.appendChild(selection, createTopic(locale.subTopic))
  }

  function handleSpaceKeydown(e: KeyboardEvent) {
    const id = types.getTopicId(e.target)
    e.preventDefault()
    if (!selection || !id) return
    const element = document.querySelector<HTMLDivElement>(id)
    element?.focus()
    selectText(element!)
    viewModel.setMode(EDITOR_MODE.edit)
  }

  function deleteNode() {
    model.deleteNode(selection)
  }

  useEffect(() => {
    if (mode === EDITOR_MODE.none) {
      hotkeys(HOTKEYS.tab, hotkeyOptions, appendChild)
      hotkeys(HOTKEYS.space, hotkeyOptions, handleSpaceKeydown)
      hotkeys(HOTKEYS.backspace, hotkeyOptions, deleteNode)
    }

    return () => {
      hotkeys.unbind(HOTKEYS.tab, appendChild)
      hotkeys.unbind(HOTKEYS.space, handleSpaceKeydown)
      hotkeys.unbind(HOTKEYS.backspace, deleteNode)
    }
  }, [mode, selection, locale.subTopic, hotkeyOptions, model, viewModel])

  useEventListener('dblclick', editTopic, {
    target: view,
  })
  useEventListener('keyup', exitEditMode, {
    target: view,
  })
  useEventListener('keydown', handleKeyDown, {
    target: view,
  })
}

export { useEditTopic }
