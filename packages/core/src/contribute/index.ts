import { useLocale } from '../context/locale'
import { Model } from '../model'
import { ViewModel } from '../viewModel'
import {
  Contribution,
  ContributionAPI,
  Slot,
  UseContributionProps,
} from '../interface/contribute'
import { ViewType } from '../constant'

function useContributionAPI(props: UseContributionProps) {
  const model = Model.useContainer()
  const viewModel = ViewModel.useContainer()
  const locale = useLocale()
  const { view, layout } = props
  return { model, viewModel, view, locale, layout }
}

function useContributions(api: ContributionAPI, contributions: Contribution[]) {
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

  isMindmap(target: EventTarget | null): target is HTMLDivElement {
    return Boolean(
      target instanceof HTMLDivElement &&
        target.closest(`[data-type="${ViewType.mindmap}"]`),
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
}

export { useContributions, types, useContributionAPI }
