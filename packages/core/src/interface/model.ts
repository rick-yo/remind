import { TopicData } from './topic'

interface IModelStructure {
  root: TopicData
}

interface IModelTrait {
  update: (updater: (root: IModelStructure) => void) => void
  appendChild(parentId: string, node: TopicData): void
  deleteNode(id: string): void
  updateNode(id: string, node: Partial<TopicData>): void
  undo(): void
  redo(): void
}

export type { IModelStructure, IModelTrait }
