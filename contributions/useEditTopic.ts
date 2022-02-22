import { EDITOR_MODE, KEY_MAPS } from '../src/constant'
import { Contribution, types } from '../src/contribute'
import { assert } from '../src/utils/assert'
import { selectText } from '../src/utils/dom'
import { useEventListener } from '../src/utils/useEventListener'

const useEditTopic: Contribution = (api) => {
  const { model, viewModel, view } = api

  function exitEditMode(e: KeyboardEvent) {
    if (!types.isTopic(e.target)) return
    if (
      [KEY_MAPS.Enter, KEY_MAPS.Escape].includes(e.key)
      // &&  mode === EDITOR_MODE.edit
    ) {
      viewModel.setMode(EDITOR_MODE.regular)
      assert(e.target instanceof HTMLDivElement)
      model.updateNode(viewModel.selectedNodeId, {
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

  useEventListener('dblclick', editTopic, {
    target: view,
  })
  useEventListener('keyup', exitEditMode, {
    target: view,
  })
}

export { useEditTopic }
