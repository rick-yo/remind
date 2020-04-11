import { TreeNode } from '../types/xmind';
import hierarchy, { Options } from '@antv/hierarchy'
import { TOPIC_FONT_SIZE } from '../constant'

const defaultOptions: Options<TreeNode> = {
  getSubTreeSep(d) {
    if (!d.children || !d.children.length) {
      return 0
    }
    return 100
  },
  getWidth(d) {
    return TOPIC_FONT_SIZE * d.title.length
  }
}


export default function (root: TreeNode, options: Options<TreeNode> = defaultOptions) {
  return hierarchy.mindmap(root, options)
}