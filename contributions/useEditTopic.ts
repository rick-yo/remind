import { EDITOR_MODE, KEY_MAPS } from '../src/constant'
import { Contribution, ViewType } from '../src/contribute'
import { selectText } from '../src/utils/dom'

const useEditTopic: Contribution = (api) => {
  const { model, viewModel } = api

  function exitEditMode(e: KeyboardEvent) {
    if (
      [KEY_MAPS.Enter, KEY_MAPS.Escape].includes(e.key)
      // &&  mode === EDITOR_MODE.edit
    ) {
      viewModel.setMode(EDITOR_MODE.regular)
      // Assert(e.currentTarget instanceof HTMLDivElement)
      model.updateNode(viewModel.selectedNodeId, {
        title: e.currentTarget.textContent ?? '',
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

  return {
    events: {
      onDblClick: editTopic,
      onKeyUp: exitEditMode,
    },
  }
}

useEditTopic.viewType = ViewType.topic

export { useEditTopic }
