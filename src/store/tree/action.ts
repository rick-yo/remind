import * as actionTypes from './actionTypes'
import createAction from '../createAction'

export const insertBefore = createAction(actionTypes.INSERT_BEFORE)

export const insertAfter = createAction(actionTypes.INSERT_AFTER)

export const appendChild = createAction(actionTypes.APPEND_CHILD)

export const deleteNode = createAction(actionTypes.DELETE_NODE)

export const updateNode = createAction(actionTypes.UPDATE_NODE)

export const setRoot = createAction(actionTypes.SET_ROOT)

export const saveHistory = createAction(actionTypes.SAVE_HISTORY)

export const undoHistory = createAction(actionTypes.UNDO_HISTORY)

export const redoHistory = createAction(actionTypes.REDO_HISTORY)
