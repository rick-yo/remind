import { EDITOR_MODE } from '../constant'
import { LayoutNode } from './topic'

interface IViewModelStructure {
  mode: EDITOR_MODE
  selection: string
  mindMap?: LayoutNode
  globalState: Map<string, any>
}

interface IViewModelTrait {
  setMode(mode: EDITOR_MODE): void
  select(selection: string): void
  setMindmap(mindMap: LayoutNode): void
  setGlobalState(key: string, value: any): void
}

export type { IViewModelStructure, IViewModelTrait }
