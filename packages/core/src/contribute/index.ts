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
import { isHTMLElement, isSVGElement } from '../utils/is'

function useContributionAPI(props: UseContributionProps) {
  const model = Model.useContainer()
  const viewModel = ViewModel.useContainer()
  const locale = useLocale()
  const { view, layout, textEditor } = props
  return { model, viewModel, view, locale, layout, textEditor }
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
  getTopicElementByChild(target: SVGElement) {
    return target.closest<SVGElement>(`[data-type="${ViewType.topic}"]`)
  },

  isTopic(target: EventTarget | null): target is SVGElement {
    return Boolean(isSVGElement(target) && this.getTopicElementByChild(target))
  },

  isMindmap(target: EventTarget | null): target is HTMLElement {
    return Boolean(
      isHTMLElement(target) &&
        target.closest(`[data-type="${ViewType.mindmap}"]`),
    )
  },

  getTopicId(target: EventTarget | null) {
    if (isSVGElement(target)) {
      return this.getTopicElementByChild(target)?.dataset.id
    }
  },

  getTopicElementById(id: string) {
    return document.querySelector(`[data-id="${id}"]`)
  },
}

export { useContributions, types, useContributionAPI }
