import type { Theme } from './theme'

declare module 'd3-hierarchy' {
  export interface HierarchyNode<Datum> {
    /**
     * The associated data, as specified to the constructor.
     */
    data: Datum
    size: [number, number]
    /**
     * DO not use this id, use data.id instead
     * @deprecated
     * @private
     */
    readonly id?: string | undefined
    /**
     * Used for mindmap layout algorithm
     * @private
     */
    x: number
    y: number
    startY: number
    totalHeight: number
  }
}

type LayoutType = 'mindmap' | 'structure'

interface LayoutOption {
  layout: LayoutType
  theme: Theme
}

export type { LayoutType, LayoutOption }
