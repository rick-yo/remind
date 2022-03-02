import { TopicData } from './topic'

interface IModelStructure {
  /**
   * Stores the tree data passed by `value` option
   */
  root: TopicData
}

type Updater = (model: IModelStructure) => void

interface IModelTrait {
  /**
   * Update model, updater must be synchronous and you cannot mutate model outside `updater`.
   * `update` will push a history record into model.
   */
  update: (updater: Updater) => void
  /**
   * Append child `node` to parent
   * @param parentId
   * @param node
   */
  appendChild(parentId: string, node: Partial<TopicData>): void
  /**
   * Delete node by id
   * @param id
   */
  deleteNode(id: string): void
  /**
   * Update node by id
   * @param id
   * @param node
   */
  updateNode(id: string, node: Partial<TopicData>): void
  /**
   * Get node by id
   * @param id
   */
  getNodeById(id: string): TopicData | undefined
  /**
   * Get parent node by id
   * @param id
   */
  getParentNodeById(id: string): TopicData | undefined
  getPreviousSibling(id: string): TopicData | undefined
  getNextSibling(id: string): TopicData | undefined
  /**
   * Undo history
   */
  undo(): void
  /**
   * Redo history
   */
  redo(): void
}

export type { IModelStructure, IModelTrait }
