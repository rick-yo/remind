import { EDITOR_MODE } from '../constant'
import { LayoutTopic } from './topic'

interface IViewModelStructure {
  /**
   * Editor mode, should be one of `EDITOR_MODE`
   */
  mode: EDITOR_MODE
  /**
   * First selected node of editor. Shorthand for `selections[0]`.
   */
  selection: string
  /**
   * Selected nodes of editor.
   */
  selections: string[]
  /**
   * Positioned tree data compute from model.root, used for render
   */
  layoutRoot?: LayoutTopic
  /**
   * Store user defined state, often used to add `contributions` to editor
   */
  globalState: Map<string, any>
}

interface IViewModelTrait {
  /**
   * Set current editor mode
   * @param mode
   */
  setMode(mode: EDITOR_MODE): void
  /**
   * Get `LayoutTopic` by coordination
   * @param mode
   */
  hitTest(x: number, y: number): LayoutTopic | undefined
  /**
   * Set current selected node
   * @param ids
   */
  select(ids: string | string[]): void
  /**
   * For internal use, Do not call it inside `contribution`
   * @param layoutRoot
   * @protected
   */
  setLayoutRoot(layoutRoot: LayoutTopic): void
  /**
   * Update globalState
   * @param key
   * @param value
   */
  setGlobalState(key: string, value: any): void
}

export type { IViewModelStructure, IViewModelTrait }
