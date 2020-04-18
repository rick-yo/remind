import { TopicData } from 'xmind-model/types/models/topic';
import { createStore, StateSelector } from 'relax-ts';
import { findNodeParent, findNode } from '../utils/tree';
import { ATTACHED_KEY } from '../constant';

type IState = {
  timeline: TopicData[];
  current: number;
};
type Payload = {
  id: string;
  node: TopicData;
};

const UNDO_HISTORY = 'UNDO_HISTORY';
const REDO_HISTORY = 'REDO_HISTORY';
const SAVE_HISTORY = 'SAVE_HISTORY';

const root = {
  id: '545be2df-3fe3-43d8-8038-7bf8fd567273',
  title: 'Central Topic',
  style: { id: '1e083a71-9f42-44dd-838e-3b13c5799ef3', properties: {} },
  children: {
    attached: [
      {
        title: 'main topic 2',
        id: 'd5b93d9e-4a3b-49fe-83a0-f4cb61397246',
        style: { id: '052e665a-23dd-41fe-b034-7382705ef863', properties: {} },
      },
      {
        title: 'main topic 1',
        id: '7312ed2e-b90f-44a8-b0bd-fa4df6c9708c',
        style: { id: '17b8ae83-9b85-4cfc-9787-595b6a4bae90', properties: {} },
        children: {
          attached: [
            {
              title: 'main topic sub topic 1',
              id: 'd5b93d9e-4a3b-49fe-83a0-f4cb61397241',
              style: {
                id: '052e665a-23dd-41fe-b034-7382705ef263',
                properties: {},
              },
            },
          ],
        },
      },
    ],
  },
};

const initialState: IState = {
  current: 0,
  timeline: [root],
};

const store = createStore({
  state: initialState,
  reducers: {
    APPEND_CHILD(state, payload: Payload) {
      const root = state.timeline[state.current];
      if (!payload.id || !payload.node) return;
      const parentNode = findNode(root, payload.id);
      if (!parentNode) return;
      parentNode.children = parentNode.children || {
        [ATTACHED_KEY]: [],
      };
      parentNode.children[ATTACHED_KEY] =
        parentNode.children[ATTACHED_KEY] || [];
      parentNode.children[ATTACHED_KEY].push(payload.node);
    },
    DELETE_NODE(state, id: string) {
      if (!id) return;
      const root = state.timeline[state.current];
      const parentNode = findNodeParent(root, id);
      if (parentNode && parentNode.children) {
        const previouseIndex = parentNode.children[ATTACHED_KEY].findIndex(
          item => item.id === id
        );
        parentNode.children[ATTACHED_KEY].splice(previouseIndex, 1);
      }
    },
    UPDATE_NODE(state, payload) {
      if (!payload.id) return;
      const root = state.timeline[state.current];
      const currentNode = findNode(root, payload.id);
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
type Dispatch = typeof originalDispatch;

const getState = (): TopicData => {
  const state = originalGetState();
  return state.timeline[state.current];
};

const dispatch: Dispatch = async (action, payload) => {
  if (action === SAVE_HISTORY) {
    console.warn('Should not dispatch inner action outside store!');
    return;
  }
  originalDispatch(action, payload);
  if (action !== UNDO_HISTORY && action !== REDO_HISTORY) {
    originalDispatch('SAVE_HISTORY', getState());
  };
};

const useSelector = <P>(selector: StateSelector<TopicData, P>) => {
  const rootState = store.useSelector(s => s);
  return selector(rootState.timeline[rootState.current]);
};

export { getState, dispatch, useSelector };

// setTimeout(() => {
//   dispatch('APPEND_CHILD', {
//     id: root.id,
//     node: {
//       title: 'APPEND_CHILD_TEST'
//     }
//   })
// }, 1000);

// setTimeout(() => {
//   dispatch('UPDATE_NODE', {
//     id: root.id,
//     node: {
//       title: 'UPDATE_NODE_TEST'
//     }
//   })
// }, 2000);
