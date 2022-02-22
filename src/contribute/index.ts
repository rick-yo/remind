import { JSXInternal } from 'preact/src/jsx'
import * as hooks from 'preact/hooks'
import { Model } from '../model'
import { ViewModel } from '../viewModel'
import { LayoutNode } from '../types'

type Events = JSXInternal.DOMAttributes<HTMLDivElement>

enum ViewType {
  mindmap,
  topic,
}

interface ContributionAPI {
  model: ReturnType<typeof Model.useContainer>
  viewModel: ReturnType<typeof ViewModel.useContainer>
  hooks: typeof hooks
  node?: LayoutNode
}

interface ContributionResult {
  events: Events
}

interface Contribution {
  (api: ContributionAPI): ContributionResult
  viewType: ViewType
}

function combineHandler<T extends any[]>(
  a: (...args: T) => void,
  b?: (...args: T) => void,
): (...args: T) => void {
  return (...args: T) => {
    a(...args)
    b?.(...args)
  }
}

function reduceEvents(events: Events[]) {
  const reducedEvents: Partial<Events> = {}
  events.reduce((p, c) => {
    if (typeof c !== 'object') return p
    const kv = Object.entries(c)
    kv.forEach(([key, value]) => {
      p[key] = combineHandler(value, p[key])
    })
    return p
  }, reducedEvents)
  return reducedEvents
}

function useContributionAPI() {
  const model = Model.useContainer()
  const viewModel = ViewModel.useContainer()
  return { model, viewModel, hooks }
}

function useMindmapContributions(
  contributions: Contribution[],
): ContributionResult {
  const api = useContributionAPI()
  const points = contributions
    .filter((point) => point.viewType === ViewType.mindmap)
    .map((contribute) => contribute({ ...api }))
  return {
    events: reduceEvents(points.map((p) => p.events)),
  }
}

function useTopicContributions(
  contributions: Contribution[],
  node: LayoutNode,
): ContributionResult {
  const api = useContributionAPI()
  const points = contributions
    .filter((point) => point.viewType === ViewType.topic)
    .map((contribute) => contribute({ ...api, node }))
  return {
    events: reduceEvents(points.map((p) => p.events)),
  }
}

export { useMindmapContributions, useTopicContributions, ViewType }
export type { Contribution }
