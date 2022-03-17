import { HierarchyTopic } from '../interface/topic'

function isObject(obj: unknown): obj is object {
  return obj !== null && typeof obj === 'object'
}

function isString(obj: unknown): obj is string {
  return typeof obj === 'string'
}

const isSVGElement = (el: unknown): el is SVGElement => el instanceof SVGElement

const isHTMLElement = (el: unknown): el is HTMLElement =>
  el instanceof HTMLElement

const topicType = {
  isRoot(node: HierarchyTopic) {
    return node.depth === 0
  },
  isMain(node: HierarchyTopic) {
    return node.depth === 1
  },
  isSub(node: HierarchyTopic) {
    return node.depth > 1
  },
}

export { isObject, isHTMLElement, isSVGElement, isString, topicType }
