declare module '@antv/hierarchy' {
  export function mindmap<Data>(root: Data, option: Options<Data>): HierachyNode<Data>
  
  export interface HierachyNode<Data> {
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
    children: HierachyNode<Data>[]
    // prototype
    translate(x: number, y: number): void
    eachNode(cb: (node: HierachyNode<Data>) => void): void
  }
  
  export interface Options<Data> {
    getSubTreeSep(d: Data): number
    getWidth(d: Data): number
  }
}
