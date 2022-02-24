import { useEffect } from 'preact/hooks'
import { Contribution, types } from '../src/contribute'
import { useEventListener } from '../src/utils/useEventListener'

const useSelection: Contribution = (api) => {
  const { model, viewModel, view } = api
  const { selectedNodeId } = viewModel

  function selectNode(e: MouseEvent) {
    const id = types.getTopicId(e.target) ?? ''
    viewModel.selectNode(id)
  }

  useEventListener(
    'click',
    (e) => {
      if (!selectedNodeId) return
      if (types.isTopic(e.target)) return
      viewModel.selectNode('')
    },
    {
      target: view,
    },
  )

  useEventListener('click', selectNode, {
    target: view,
  })

  // Select root topic after initial render
  useEffect(() => {
    setTimeout(() => {
      viewModel.selectNode(model.root.id)
    }, 500)
  }, [])
}

export { useSelection }
