declare module '@antv/hierarchy' {
  export function mindmap<Data> (
    root: Data,
    option: Options<Data>
  ): HierachyNode<Data>

  export interface HierachyNode<Data = Object> {
    depth: number
    height: number
    hgap: number
    id: string
    parent: HierachyNode<Data>
    startY: number
    totalHeight: number
    vgap: number
    width: number
    x: number
    y: number
    data: Data
    children: Array<HierachyNode<Data>>
    // FIXME inherit from TopicData
    side: 'left' | 'right'
    // prototype
    translate(x: number, y: number): void
    eachNode(cb: (node: HierachyNode<Data>) => void): void
    getBoundingBox(): {
      width: number
      height: number
      left: number
      top: number
    }
  }

  export interface Options<Data> {
    direction?: 'H' | 'V' | 'LR' | 'RL' | 'TB' | 'BT'
    getSubTreeSep(d: Data): number
    getWidth(d: Data): number
    getHeight(d: Data): number
    getHGap(d: Data): number
    getVGap(d: Data): number
    getId(d: Data): string
    getChildren(d: Data): Data[]
    getSide?(d: Data): 'left' | 'right'
  }
}
