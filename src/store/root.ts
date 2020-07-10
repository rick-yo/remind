import { TopicData } from 'xmind-model/types/models/topic';
import { createStore, StateSelector } from 'relax-ts';
import { topicWalker, normalizeTopicSide } from '../utils/tree';
import { ATTACHED_KEY } from '../constant';
import { debug } from '../utils/debug';
import editorStore from './editor';
import produce from 'immer';
import { MindmapProps } from '../index';

type IState = {
  timeline: TopicData[];
  current: number;
  onChange: MindmapProps['onChange'];
  readonly: boolean;
};

type Payload = {
  id: string;
  node: TopicData;
};

const UNDO_HISTORY = 'UNDO_HISTORY';
const REDO_HISTORY = 'REDO_HISTORY';
const SAVE_HISTORY = 'SAVE_HISTORY';

const defaultRoot: TopicData = produce(
  {
    id: '545be2df-3fe3-43d8-8038-7bf8fd567273',
    title: 'Central Topic',
    children: {
      attached: [
        {
          title: 'main topic 2',
          id: 'd5b93d9e-4a3b-49fe-83a0-f4cb61397246',
        },
        {
          title: 'main topic 1',
          id: '7312ed2e-b90f-44a8-b0bd-fa4df6c9708c',
        },
      ],
    },
  },
  normalizeTopicSide
);

export const initialState: IState = {
  current: 0,
  timeline: [defaultRoot],
  onChange: () => {},
  readonly: false
};

const store = createStore({
  state: initialState,
  reducers: {
    APPEND_CHILD(state, payload: Payload) {
      const root = state.timeline[state.current];
      if (!payload.id || !payload.node) return;
      const parentNode = topicWalker.getNode(root, payload.id);
      if (!parentNode) return;
      parentNode.children = parentNode.children || {
        [ATTACHED_KEY]: [],
      };
      if (parentNode === root) {
        const leftNodes = parentNode.children[ATTACHED_KEY].filter(
          node => node.side === 'left'
        );
        if (parentNode.children[ATTACHED_KEY].length / 2 > leftNodes.length) {
          payload.node.side = 'left';
        } else {
          payload.node.side = 'right';
        }
      }
      parentNode.children[ATTACHED_KEY] =
        parentNode.children[ATTACHED_KEY] || [];
      parentNode.children[ATTACHED_KEY].push(payload.node);
    },
    DELETE_NODE(state, id: string) {
      if (!id) return;
      const root = state.timeline[state.current];
      const parentNode = topicWalker.getParentNode(root, id);
      if (parentNode && parentNode.children) {
        const previouseIndex = parentNode.children[ATTACHED_KEY].findIndex(
          (item: TopicData) => item.id === id
        );
        const children = parentNode.children[ATTACHED_KEY];
        children.splice(previouseIndex, 1);
        // when deleted a node, select deleted node's sibing or parent
        const sibling =
          children[previouseIndex] ||
          children[previouseIndex - 1] ||
          children[previouseIndex + 1];
        const selectedNode = sibling || parentNode;
        editorStore.dispatch('SELECT_NODE', selectedNode.id);
      }
    },
    UPDATE_NODE(state, payload) {
      if (!payload.id) return;
      const root = state.timeline[state.current];
      const currentNode = topicWalker.getNode(root, payload.id);
      currentNode && Object.assign(currentNode, payload.node);
    },
    [UNDO_HISTORY](state) {
      state.current = Math.max(0, state.current - 1);
    },
    [REDO_HISTORY](state) {
      state.current = Math.min(state.timeline.length - 1, state.current + 1);
    },
    [SAVE_HISTORY](state, newRoot) {
      const { timeline, current } = state;
      state.timeline = timeline.slice(0, current + 1);
      state.timeline.push(newRoot);
      state.current = state.timeline.length - 1;
    },
  },
  effects: {},
});

const originalDispatch = store.dispatch;
const originalGetState = store.getState;
const Provider = store.Provider;
type Dispatch = typeof originalDispatch;

const getState = (): TopicData => {
  const state = originalGetState();
  return state.timeline[state.current];
};

const dispatch: Dispatch = async (action, payload) => {
  if (store.getState().readonly) return;
  debug('dispatch action', action);
  if (action === SAVE_HISTORY) {
    console.warn('Should not dispatch inner action outside store!');
    return;
  }
  if (action !== UNDO_HISTORY && action !== REDO_HISTORY) {
    originalDispatch('SAVE_HISTORY', getState());
  }
  originalDispatch(action, payload);
  store.getState().onChange?.(getState());
};

const useSelector = <P>(selector: StateSelector<TopicData, P>) => {
  const rootState = store.useSelector(s => s);
  return selector(rootState.timeline[rootState.current]);
};

export { getState, dispatch, useSelector, defaultRoot, Provider };
