import { TopicData } from 'xmind-model/types/models/topic';
import produce from 'immer';
import {
  getLeftNode,
  HierachyNodeWithTopicData,
  getRighttNode,
  getTopNode,
  getBottomNode,
} from '../utils/tree';
import { EDITOR_MODE } from '../constant';
import { useState } from 'react';
import { createContainer } from 'unstated-next';

type IState = {
  mode: EDITOR_MODE;
  selectedNodeId: string;
  scale: number;
  dragingNode: TopicData | null;
  readonly: boolean;
  translate: [number, number];
};

export const defaultState: IState = {
  mode: EDITOR_MODE.regular,
  selectedNodeId: '',
  scale: 1,
  dragingNode: null,
  readonly: false,
  translate: [0, 0],
};

function useEditor(initialState: Partial<IState> = {}) {
  const [state, setState] = useState({ ...defaultState, ...initialState });
  function SET_MODE(payload: EDITOR_MODE) {
    if (state.readonly) return;
    state.mode = payload;
  }
  function SELECT_NODE(payload: string) {
    setState(prevState => ({ ...prevState, selectedNodeId: payload }));
  }
  function DRAG_NODE(payload: TopicData | null) {
    // remove TopicData's depth、side
    const dragingNode = produce(payload, draft => {
      delete draft?.side;
      delete draft?.depth;
    });
    setState(prevState => ({ ...prevState, dragingNode }));
  }
  function SET_SCALE(scale: number) {
    setState(prevState => ({ ...prevState, scale }));
  }
  function SET_TRANSLATE(translate: [number, number]) {
    setState(prevState => ({ ...prevState, translate }));
  }
  function MOVE_LEFT(rootWithCoords: HierachyNodeWithTopicData) {
    const target = getLeftNode(rootWithCoords, state.selectedNodeId);
    if (target) {
      setState(prevState => ({ ...prevState, selectedNodeId: target.data.id }));
    }
  }
  function MOVE_RIGHT(rootWithCoords: HierachyNodeWithTopicData) {
    const target = getRighttNode(rootWithCoords, state.selectedNodeId);
    if (target) {
      setState(prevState => ({ ...prevState, selectedNodeId: target.data.id }));
    }
  }
  function MOVE_TOP(rootWithCoords: HierachyNodeWithTopicData) {
    const target = getTopNode(rootWithCoords, state.selectedNodeId);
    if (target) {
      setState(prevState => ({ ...prevState, selectedNodeId: target.data.id }));
    }
  }
  function MOVE_DOWN(rootWithCoords: HierachyNodeWithTopicData) {
    const target = getBottomNode(rootWithCoords, state.selectedNodeId);
    if (target) {
      setState(prevState => ({ ...prevState, selectedNodeId: target.data.id }));
    }
  }
  return {
    ...state,
    SET_MODE,
    SELECT_NODE,
    DRAG_NODE,
    SET_SCALE,
    SET_TRANSLATE,
    MOVE_LEFT,
    MOVE_RIGHT,
    MOVE_TOP,
    MOVE_DOWN,
  };
}

const EditorStore = createContainer(useEditor);

export default EditorStore;
