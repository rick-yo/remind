import { useEffect } from 'preact/hooks'
import { Contribution, types } from '../src/contribute'
import { useEventListener } from '../src/utils/useEventListener'

const useSelection: Contribution = (api) => {
  const { model, viewModel, view } = api
  const { selection } = viewModel

  function selectNode(e: MouseEvent) {
    const id = types.getTopicId(e.target) ?? ''
    viewModel.select(id)
  }

  useEventListener(
    'click',
    (e) => {
      if (!selection) return
      if (types.isTopic(e.target)) return
      viewModel.select('')
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
      viewModel.select(model.root.id)
    }, 500)
  }, [])
}

export { useSelection }
