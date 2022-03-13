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
  }
}

type LayoutType = 'mindmap' | 'structure'

export type { LayoutType }
