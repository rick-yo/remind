import { RefObject } from 'preact'
import { ViewType } from '../constant'
import { IntlContent } from './intl'
import { LayoutType } from './layout'
import { IModelStructure, IModelTrait } from './model'
import { TextEditor } from './textEditor'
import { IViewModelStructure, IViewModelTrait } from './viewModel'

type Slot = JSX.Element & {
  /**
   * Define slot's render position in editor
   */
  viewType?: ViewType
}

interface UseContributionProps {
  view: RefObject<HTMLDivElement>
  layout: LayoutType
  textEditor: TextEditor
}

interface ContributionAPI {
  model: IModelStructure & IModelTrait
  viewModel: IViewModelStructure & IViewModelTrait
  locale: IntlContent
  view: RefObject<HTMLDivElement>
  layout: LayoutType
  textEditor: TextEditor
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

export type { UseContributionProps, Contribution, Slot, ContributionAPI }
