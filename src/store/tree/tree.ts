import { TreeNode } from '../../types/xmind'

export function findNode(root: TreeNode, id: string): TreeNode | undefined {
  let target: TreeNode | undefined
  eachBefore(root, node => {
    if (node.id === id) target = node
  })
  return target
}

export function findNodeParent(root: TreeNode, id: string): TreeNode | undefined {
  let target: TreeNode | undefined
  eachBefore(root, node => {
    if (!Array.isArray(node.children)) return
    if (node.children.some(item => item.id === id)) target = node
  })
  return target
}

function eachBefore<T = any>(node: T, callback: (node: T) => void) {
  // tslint:disable-next-line
  let nodes = [node],
    children,
    i
  // @ts-ignore
  // tslint:disable-next-line: no-parameter-reassignment
  // tslint:disable-next-line: no-conditional-assignment
  while ((node = nodes.pop())) {
    // @ts-ignore
    callback(node), (children = node.children)
    if (children) {
      for (i = children.length - 1; i >= 0; --i) {
        nodes.push(children[i])
      }
    }
  }
}
