import * as hooks from 'preact/hooks'
import { RefObject } from 'preact'
import { Model } from '../model'
import { ViewModel } from '../viewModel'
import { LayoutNode } from '../types'
import { assert } from '../utils/assert'

const { useMemo } = hooks

enum ViewType {
  mindmap,
  topic,
}

interface ContributionAPI {
  model: ReturnType<typeof Model.useContainer>
  viewModel: ReturnType<typeof ViewModel.useContainer>
  view: RefObject<HTMLDivElement>
  hooks: typeof hooks
  node?: LayoutNode
}

type Contribution = (api: ContributionAPI) => void

interface UseContributionProps {
  view: RefObject<HTMLDivElement>
}

function useContributions(props: UseContributionProps) {
  const model = Model.useContainer()
  const viewModel = ViewModel.useContainer()
  const { view } = props
  const api = useMemo(() => {
    return { model, viewModel, view, hooks }
  }, [model, viewModel, view])
  return api
}

const types = {
  isTopic(target: EventTarget) {
    assert(target instanceof HTMLDivElement)
    return target.closest(`[data-type="${ViewType.topic}"]`)
  },

  isMindmap(target: EventTarget) {
    assert(target instanceof HTMLDivElement)
    return target.closest(`[data-type="${ViewType.mindmap}"]`)
  },
}

export { useContributions, ViewType, types }
export type { Contribution }
