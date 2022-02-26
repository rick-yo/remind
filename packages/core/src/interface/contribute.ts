import { RefObject } from 'preact'
import { IntlContent } from './intl'
import { IModelStructure, IModelTrait } from './model'
import { IViewModelStructure, IViewModelTrait } from './viewModel'

enum ViewType {
  mindmap,
  topic,
  link,
}
type Slot = JSX.Element & { viewType?: ViewType }

interface ContributionAPI {
  model: IModelStructure & IModelTrait
  viewModel: IViewModelStructure & IViewModelTrait
  view: RefObject<HTMLDivElement>
  locale: IntlContent
}

interface ContributionResult {
  slots?: Slot[]
}

type Contribution = (api: ContributionAPI) => ContributionResult | void

interface UseContributionProps {
  view: RefObject<HTMLDivElement>
  contributions: Contribution[]
}

export { ViewType }
export type { UseContributionProps, Contribution, Slot }
