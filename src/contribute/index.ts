import * as hooks from 'preact/hooks'
import { RefObject } from 'preact'
import { Model } from '../model'
import { ViewModel } from '../viewModel'
import { useLocale } from '../context/locale'
import { IntlValue } from '../utils/Intl'

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
  locale: IntlValue
}

type Contribution = (api: ContributionAPI) => void

interface UseContributionProps {
  view: RefObject<HTMLDivElement>
  contributions: Contribution[]
}

function useContributions(props: UseContributionProps) {
  const model = Model.useContainer()
  const viewModel = ViewModel.useContainer()
  const locale = useLocale()
  const { view, contributions } = props
  const api = useMemo(() => {
    return { model, viewModel, view, hooks, locale }
  }, [model, viewModel, view])

  contributions.forEach((contribution) => {
    contribution(api)
  })
}

const types = {
  isTopic(target: EventTarget | null): target is HTMLDivElement {
    return Boolean(
      target instanceof HTMLDivElement &&
        target.closest(`[data-type="${ViewType.topic}"]`),
    )
  },

  getTopicId(target: EventTarget | null) {
    if (target instanceof HTMLDivElement) {
      return target.dataset.id
    }

    return ''
  },

  isMindmap(target: EventTarget | null) {
    return (
      target instanceof HTMLDivElement &&
      target.closest(`[data-type="${ViewType.mindmap}"]`)
    )
  },
}

export { useContributions, ViewType, types }
export type { Contribution }
