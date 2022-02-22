import { Contribution, ViewType } from '../src/contribute'

const useSelection: Contribution = (api) => {
  const { viewModel, node } = api

  function selectNode() {
    viewModel.selectNode(node.data.id)
  }

  return {
    events: {
      onClick: selectNode,
    },
  }
}

useSelection.viewType = ViewType.topic

export { useSelection }
