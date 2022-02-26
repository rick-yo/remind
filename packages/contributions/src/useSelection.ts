import { Contribution, types, useEventListener, useEffect } from 'remindjs-core'

const useSelection: Contribution = (api) => {
  const { model, viewModel, view } = api
  const { selection } = viewModel

  function selectNode(e: MouseEvent) {
    const id = types.getTopicId(e.target) ?? ''
    viewModel.select(id)
  }

  function selectNone(e: MouseEvent) {
    if (!selection) return
    if (types.isTopic(e.target)) return
    viewModel.select('')
  }

  useEventListener('click', selectNone, {
    target: view,
  })

  useEventListener('click', selectNode, {
    target: view,
  })

  // Select root topic after initial render
  useEffect(() => {
    setTimeout(() => {
      viewModel.select(model.root.id)
    }, 500)
  }, [])
}

export { useSelection }
