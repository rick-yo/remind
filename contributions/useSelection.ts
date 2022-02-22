import { Contribution } from '../src/contribute'
import { useEventListener } from '../src/utils/useEventListener'

const useSelection: Contribution = (api) => {
  const { viewModel, node, view } = api

  function selectNode() {
    viewModel.selectNode(node.data.id)
  }

  useEventListener('click', selectNode, {
    target: view,
  })
}

export { useSelection }
