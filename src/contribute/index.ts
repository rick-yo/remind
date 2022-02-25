import { JSX, RefObject } from 'preact'
import { useMemo } from 'preact/hooks'
import { Model } from '../model'
import { ViewModel } from '../viewModel'
import { useLocale } from '../context/locale'
import { IntlValue } from '../utils/Intl'

enum ViewType {
  mindmap,
  topic,
  link,
}
type Slot = JSX.Element & { viewType?: ViewType }

interface ContributionAPI {
  model: ReturnType<typeof Model.useContainer>
  viewModel: ReturnType<typeof ViewModel.useContainer>
  view: RefObject<HTMLDivElement>
  locale: IntlValue
}

interface ContributionResult {
  slots?: Slot[]
}

type Contribution = (api: ContributionAPI) => ContributionResult | void

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
    return { model, viewModel, view, locale }
  }, [model, viewModel, view])

  const results = contributions.map((contribution) => contribution(api))
  const slots = results.reduce<Slot[]>((p, c) => {
    if (c?.slots) {
      p.push(...c.slots)
    }

    return p
  }, [])
  return {
    slots,
  }
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

  getTopicElementById(id: string) {
    return document.querySelector(`[data-id="${id}"]`)
  },

  isMindmap(target: EventTarget | null) {
    return (
      target instanceof HTMLDivElement &&
      target.closest(`[data-type="${ViewType.mindmap}"]`)
    )
  },
}

export { useContributions, ViewType, types }
export type { Contribution, Slot }
