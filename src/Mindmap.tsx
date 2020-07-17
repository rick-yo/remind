/** @jsx jsx */
import { useEffect, ReactElement } from 'react';
import Topic from './components/Topic';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  EDITOR_MODE,
  EDITOR_ID,
  TOPIC_FONT_FAMILY,
  CORE_EDITOR_ID,
  TOPIC_CLASS,
} from './constant';
import mindmap from './layout/mindmap';
import Links from './components/Links';
import * as rootStore from './store/root';
import editorStore from './store/editor';
import hotkeys from 'hotkeys-js';
import { createTopic } from './utils/tree';
import { debug } from './utils/debug';
import { selectText, useIconFont, useClickOutSide } from './utils/dom';
import { css, jsx } from '@emotion/core';
import Toolbar from './components/Toolbar';
import { useLocale } from './context/locale';

const Mindmap = () => {
  const root = rootStore.useSelector(s => s);
  const editorState = editorStore.useSelector(s => s);
  const { scale, translate } = editorState;
  const { mode, selectedNodeId } = editorState;
  const mindMap = mindmap(root);
  const locale = useLocale();
  useIconFont();

  const id = `#topic-${selectedNodeId}`;
  const topics: ReactElement[] = [];

  mindMap.eachNode(node => {
    topics.push(<Topic key={node.data.id} {...node} />);
  });

  // regular mode
  useEffect(() => {
    function appendChild(e: KeyboardEvent) {
      e.preventDefault();
      if (!selectedNodeId) return;
      rootStore.dispatch('APPEND_CHILD', {
        id: selectedNodeId,
        node: createTopic(locale.subTopic),
      });
    }

    function editTopic(e: KeyboardEvent) {
      e.preventDefault();
      if (!selectedNodeId) return;
      const el = document.querySelector<HTMLDivElement>(id);
      el?.focus();
      selectText(el as HTMLDivElement);
      editorStore.dispatch('SET_MODE', EDITOR_MODE.edit);
    }

    function deleteNode() {
      rootStore.dispatch('DELETE_NODE', selectedNodeId);
    }

    function moveTop(e: KeyboardEvent) {
      e.preventDefault();
      editorStore.dispatch('MOVE_TOP', mindMap);
    }
    function moveDown(e: KeyboardEvent) {
      e.preventDefault();
      editorStore.dispatch('MOVE_DOWN', mindMap);
    }
    function moveLeft(e: KeyboardEvent) {
      e.preventDefault();
      editorStore.dispatch('MOVE_LEFT', mindMap);
    }
    function moveRight(e: KeyboardEvent) {
      e.preventDefault();
      editorStore.dispatch('MOVE_RIGHT', mindMap);
    }
    function undo() {
      rootStore.dispatch('UNDO_HISTORY');
    }

    function redo() {
      rootStore.dispatch('REDO_HISTORY');
    }
    if (mode === EDITOR_MODE.regular) {
      hotkeys('tab', appendChild);
      hotkeys('space', editTopic);
      hotkeys('backspace', deleteNode);
      hotkeys('left', moveLeft);
      hotkeys('right', moveRight);
      hotkeys('up,top', moveTop);
      hotkeys('down', moveDown);
      hotkeys('command+z', undo);
      hotkeys('command+shift+z', redo);
    }
    return () => {
      hotkeys.unbind('tab', appendChild);
      hotkeys.unbind('space', editTopic);
      hotkeys.unbind('backspace', deleteNode);
      hotkeys.unbind('left', moveLeft);
      hotkeys.unbind('right', moveRight);
      hotkeys.unbind('up,top', moveTop);
      hotkeys.unbind('down', moveDown);
      hotkeys.unbind('command+z', undo);
      hotkeys.unbind('command+shift+z', redo);
    };
  }, [mode, selectedNodeId, id, mindMap, locale.subTopic]);

  // edit mode
  useClickOutSide(
    id,
    () => {
      if (mode !== EDITOR_MODE.edit) return;
      if (!selectedNodeId) return;
      editorStore.dispatch('SET_MODE', EDITOR_MODE.regular);
      const el = document.querySelector<HTMLDivElement>(id);
      rootStore.dispatch('UPDATE_NODE', {
        id: selectedNodeId,
        node: {
          title: el?.innerText,
        },
      });
    },
    [mode, selectedNodeId]
  );

  useClickOutSide(
    id,
    e => {
      if (!selectedNodeId) return;
      // @ts-ignore
      const isTopic = e.target?.closest(`.${TOPIC_CLASS}`);
      if (isTopic) return;
      editorStore.dispatch('SELECT_NODE', '');
    },
    [selectedNodeId]
  );

  debug('rootWithCoords', mindMap);
  return (
    <div
      id={EDITOR_ID}
      css={css`
        position: relative;
        font-family: ${TOPIC_FONT_FAMILY};
        background: #eef8fa;
        width: ${CANVAS_WIDTH}px;
        height: ${CANVAS_HEIGHT}px;
        overflow: hidden;
      `}
    >
      <div
        id={CORE_EDITOR_ID}
        css={css`
          position: relative;
          transform: scale(${scale}, ${scale});
          translate: (${translate[0]}px, ${translate[1]}px);
          background: #eef8fa;
        `}
      >
        <svg
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          xmlns="http://www.w3.org/2000/svg"
          css={css`
            position: absolute;
            left: 0;
            top: 0;
          `}
        >
          <Links mindmap={mindMap} />
        </svg>
        {topics}
      </div>
      <Toolbar />
    </div>
  );
};

export default Mindmap;
