import { TopicData } from 'xmind-model/types/models/topic';
import {
  findNodeParent,
  findNode,
  findPreviousSibling,
  findNextSibling,
} from '../utils/tree';
import { createStore } from 'relax-ts';
import { EDITOR_MODE, ATTACHED_KEY } from '../constant';
import * as rootStore from '../store/root';

type IState = {
  mode: EDITOR_MODE;
  selectedNodeId: string;
  scale: number;
  dragingNode?: TopicData;
};

const initialState: IState = {
  mode: EDITOR_MODE.regular,
  selectedNodeId: '',
  scale: 1,
  dragingNode: undefined,
};

const store = createStore({
  state: initialState,
  reducers: {
    SET_MODE(state, payload: EDITOR_MODE) {
      state.mode = payload;
    },
    SELECT_NODE(state, payload: string) {
      state.selectedNodeId = payload;
    },
    DRAG_NODE(state, payload: TopicData) {
      state.dragingNode = payload;
    },
    SET_SCALE(state, payload: number) {
      state.scale = payload;
    },
    MOVE_LEFT(state) {
      const parent = findNodeParent(rootStore.getState(), state.selectedNodeId);
      if (parent) {
        state.selectedNodeId = parent.id;
      }
    },
    MOVE_RIGHT(state) {
      const node = findNode(rootStore.getState(), state.selectedNodeId);
      if (node && node.children && node.children[ATTACHED_KEY]) {
        const children = node.children[ATTACHED_KEY];
        if (children.length) {
          const mid = Math.min(0, Math.floor(children.length / 2));
          state.selectedNodeId = children[mid].id;
        }
      }
    },
    MOVE_TOP(state) {
      const previousSibling = findPreviousSibling(
        rootStore.getState(),
        state.selectedNodeId
      );
      if (previousSibling) {
        state.selectedNodeId = previousSibling.id;
      }
    },
    MOVE_DOWN(state) {
      const nextSibling = findNextSibling(
        rootStore.getState(),
        state.selectedNodeId
      );
      if (nextSibling) {
        state.selectedNodeId = nextSibling.id;
      }
    },
  },
  effects: {},
});

export default store;
