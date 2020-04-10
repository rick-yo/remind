import { ActionWithPayload } from '../createAction'
import * as actionTypes from './actionTypes'
import { findNode, findNodeParent } from './tree'
import produce from 'immer'
import { Reducer } from 'react'
import { TreeNode } from '@/types/xmind'

export interface TreeState {
  timeline: TreeNode[]
  current: number
}

export const defaultTree: TreeState = {
  timeline: [],
  current: -1
}

export interface Payload {
  id?: string
  node?: TreeNode
}

type TreeReducer = Reducer<TreeNode, ActionWithPayload<Payload>>

const treeReducer: TreeReducer = (tree = defaultTree.timeline[defaultTree.current], action) => {
  let next: TreeNode
  const { payload } = action
  switch (action.type) {
    case actionTypes.INSERT_BEFORE:
      next = produce(tree, draft => {
        if (!payload.id || !payload.node) return
        const parentNode = findNodeParent(draft, payload.id)
        if (parentNode && parentNode.children) {
          const previouseIndex = parentNode.children.findIndex(item => item.id === payload.id)
          parentNode.children.splice(previouseIndex, 0, payload.node)
        }
      })
      return next
    case actionTypes.INSERT_AFTER:
      next = produce(tree, draft => {
        if (!payload.id || !payload.node) return
        const parentNode = findNodeParent(draft, payload.id)
        if (parentNode && parentNode.children) {
          const previouseIndex = parentNode.children.findIndex(item => item.id === payload.id)
          parentNode.children.splice(previouseIndex + 1, 0, payload.node)
        }
      })
      return next
    case actionTypes.APPEND_CHILD:
      next = produce(tree, draft => {
        if (!payload.id || !payload.node) return
        const parentNode = findNode(draft, payload.id)
        if (parentNode && Array.isArray(parentNode.children)) {
          parentNode.children.push(payload.node)
        } else if (parentNode) {
          parentNode.children = [payload.node]
        }
      })
      return next
    case actionTypes.DELETE_NODE:
      next = produce(tree, draft => {
        if (!payload.id) return
        const parentNode = findNodeParent(draft, payload.id)
        if (parentNode && parentNode.children) {
          const previouseIndex = parentNode.children.findIndex(item => item.id === payload.id)
          parentNode.children.splice(previouseIndex, 1)
        }
      })
      return next
    case actionTypes.UPDATE_NODE:
      next = produce(tree, draft => {
        if (!payload.id) return
        const parentNode = findNodeParent(draft, payload.id)
        if (parentNode && parentNode.children) {
          const item = parentNode.children.find(item => item.id === payload.id)
          item && Object.assign(item, payload.node)
        }
      })
      return next
    default:
      return tree
  }
}

const undoRedoHighOrderReducer = (reducer: TreeReducer) => {
  const highOrderReducer = (tree: TreeState = defaultTree, action: ActionWithPayload<Payload>) => {
    switch (action.type) {
      case actionTypes.UNDO_HISTORY:
        return produce(tree, draft => {
          draft.current = Math.max(0, draft.current - 1)
        })
      case actionTypes.REDO_HISTORY:
        return produce(tree, draft => {
          draft.current = Math.min(draft.timeline.length - 1, draft.current + 1)
        })
      case actionTypes.SAVE_HISTORY:
        return produce(tree, draft => {
          if (!action.payload.node) return
          draft.timeline.push(action.payload.node)
          draft.current++
        })
      default:
        return produce(tree, state => {
          const { timeline, current } = state
          const newState = reducer(timeline[current], action)
          state.timeline = timeline.slice(0, current + 1)
          state.timeline.push(newState)
          state.current = state.timeline.length - 1
        })
    }
  }
  return highOrderReducer
}

export default undoRedoHighOrderReducer(treeReducer)
