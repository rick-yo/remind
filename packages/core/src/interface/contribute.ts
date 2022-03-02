import { RefObject } from 'preact'
import { ViewType } from '../constant'
import { IntlContent } from './intl'
import { IModelStructure, IModelTrait } from './model'
import { IViewModelStructure, IViewModelTrait } from './viewModel'

type Slot = JSX.Element & {
  /**
   * Define slot's render position in editor
   */
  viewType?: ViewType
}

interface ContributionAPI {
  model: IModelStructure & IModelTrait
  viewModel: IViewModelStructure & IViewModelTrait
  view: RefObject<HTMLDivElement>
  locale: IntlContent
}

interface ContributionResult {
  /**
   * Placeholder in editor, that render custom content
   */
  slots?: Slot[]
}

/**
 * Contribution let you extend editor's functionality, custom editor's behavior or add custom render content.
 * Contribution is custom preact hooks, so it's reactive and efficient
 * @param api expose editor's core api
 */
type Contribution = (api: ContributionAPI) => ContributionResult | void

interface UseContributionProps {
  view: RefObject<HTMLDivElement>
  contributions: Contribution[]
}

export type { UseContributionProps, Contribution, Slot }
