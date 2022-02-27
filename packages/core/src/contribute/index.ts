import { useMemo } from 'preact/hooks'
import { useLocale } from '../context/locale'
import { Model } from '../model'
import { ViewModel } from '../viewModel'
import { Slot, UseContributionProps, ViewType } from '../interface/contribute'

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

export { useContributions, types }
