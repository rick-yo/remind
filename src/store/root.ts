import { TopicData } from 'xmind-model/types/models/topic';
import { topicWalker, normalizeTopicSide, createTopic } from '../utils/tree';
import { ATTACHED_KEY } from '../constant';
import { debug } from '../utils/debug';
import editorStore from './editor';
import produce from 'immer';
import { MindmapProps } from '../index';
import { useState } from 'react';
import { createContainer, useContainer } from 'unstated-next';

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
const APPEND_CHILD = 'APPEND_CHILD';
const DELETE_NODE = 'DELETE_NODE';
const UPDATE_NODE = 'UPDATE_NODE';

const defaultRoot: TopicData = produce(
  {
    ...createTopic('Central Topic'),
    children: {
      attached: [createTopic('main topic 1'), createTopic('main topic 2')],
    },
  },
  normalizeTopicSide
);

export const defaultState: IState = {
  current: 0,
  timeline: [defaultRoot],
  onChange: () => {},
  readonly: false,
};

function useRoot(initialState: Partial<IState> = {}) {
  const [state, setState] = useState({ ...defaultState, ...initialState });

  const UNDO_HISTORY = () => {
    setState(prevState => ({
      ...prevState,
      current: Math.max(0, state.current - 1),
    }));
  };
  const REDO_HISTORY = () => {
    setState(prevState => ({
      ...prevState,
      current: Math.min(state.timeline.length - 1, state.current + 1),
    }));
  };
  const SAVE_HISTORY = (draftState: IState, newRoot: TopicData) => {
    const { timeline, current } = draftState;
    draftState.timeline = timeline.slice(0, current + 1);
    draftState.timeline.push(newRoot);
    draftState.current = draftState.timeline.length - 1;
  };
  return {
    ...state,
    [APPEND_CHILD](payload: Payload) {
      const nextState = produce(state, draftState => {
        const root = draftState.timeline[draftState.current];
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
            payload.node = produce(payload.node, draft => {
              draft.side = 'left';
            });
          } else {
            payload.node = produce(payload.node, draft => {
              draft.side = 'right';
            });
          }
        }
        parentNode.children[ATTACHED_KEY] =
          parentNode.children[ATTACHED_KEY] || [];
        parentNode.children[ATTACHED_KEY].push(payload.node);
        SAVE_HISTORY(draftState, root);
      });
      setState(nextState);
    },
    [DELETE_NODE](id: string) {
      if (!id) return;
      const nextState = produce(state, draftState => {
        const root = draftState.timeline[draftState.current];
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
          // editorStore.dispatch('SELECT_NODE', selectedNode.id);
        }
        SAVE_HISTORY(draftState, root);
      });
      setState(nextState);
    },
    [UPDATE_NODE](payload: { id: string; node: Partial<TopicData> }) {
      if (!payload.id) return;
      const nextState = produce(state, draftState => {
        const root = draftState.timeline[draftState.current];
        const currentNode = topicWalker.getNode(root, payload.id);
        currentNode && Object.assign(currentNode, payload.node);
        SAVE_HISTORY(draftState, root);
      });
      setState(nextState);
    },
    UNDO_HISTORY,
    REDO_HISTORY,
  };
}

const RootStore = createContainer(useRoot);

const RootStoreProvider = RootStore.Provider;

const useRootSelector = <T>(selector: (state: TopicData) => T) => {
  const rootState = RootStore.useContainer();
  return selector(rootState.timeline[rootState.current]);
};

export { defaultRoot, RootStoreProvider, RootStore, useRootSelector };
