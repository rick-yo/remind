/** @jsx jsx */
import React, { FC, useEffect } from 'react';
import Topic from './components/Topic';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  EDITOR_MODE,
  EDITOR_ID_SELECTOR,
} from './constant';
import mindmap from './layout/mindmap';
import Links from './components/Links';
import { ThemeContext, defaultTheme } from './context/theme';
import * as rootStore from './store/root';
import editorStore from './store/editor';
import hotkeys from 'hotkeys-js';
import { createTopic } from './utils/tree';
import { debug } from './utils/debug';
import { selectText, onClickOutSide } from './utils/dom';
import { css, jsx } from '@emotion/core';
import { LocaleContext } from './context/locale';
import Header from './components/Header';
import { IntlKey } from './utils/Intl';
import { TopicData } from 'xmind-model/types/models/topic';
import './mindmap.css';
import Toolbar from './components/Toolbar';

export interface MindmapProps {
  theme?: typeof defaultTheme;
  locale?: IntlKey;
  data?: TopicData;
  readonly?: boolean;
}

const Mindmap: FC<Required<MindmapProps>> = ({ theme, locale }) => {
  const root = rootStore.useSelector(s => s);
  const editorState = editorStore.useSelector(s => s);
  const { mode, selectedNodeId } = editorState;
  const mindMap = mindmap(root);

  const id = `#topic-${selectedNodeId}`;
  const topics: React.ReactElement[] = [];

  mindMap.eachNode(node => {
    topics.push(<Topic key={node.data.id} {...node} />);
  });

  // 常规模式下
  useEffect(() => {
    function appendChild(e: KeyboardEvent) {
      e.preventDefault();
      if (!selectedNodeId) return;
      rootStore.dispatch('APPEND_CHILD', {
        id: selectedNodeId,
        node: createTopic('子主题'),
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
  }, [mode, selectedNodeId, id, mindMap]);

  // 编辑模式下
  useEffect(() => {
    if (mode !== EDITOR_MODE.edit) return;
    const clickOutSide = onClickOutSide(id, () => {
      editorStore.dispatch('SET_MODE', EDITOR_MODE.regular);
      const el = document.querySelector<HTMLDivElement>(id);
      rootStore.dispatch('UPDATE_NODE', {
        id: selectedNodeId,
        node: {
          title: el?.innerText,
        },
      });
    });
    return () => clickOutSide();
  }, [mode, selectedNodeId, id]);

  debug('rootWithCoords', mindMap);
  return (
    <ThemeContext.Provider value={theme}>
      <LocaleContext.Provider value={{ locale }}>
        <div
          id={EDITOR_ID_SELECTOR}
          css={css`
            font-family: 微软雅黑, -apple-system;
            background: #eef8fa;
            position: 'relative';
            overflow: hidden;
          `}
        >
          <Header />
          <div
            id="core-editor"
            css={css`
              position: relative;
              transform: scale(${(editorState.scale, editorState.scale)});
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
            <div
              style={{
                width: `${CANVAS_WIDTH}px`,
                height: `${CANVAS_HEIGHT}px`,
                position: 'relative',
              }}
            >
              {topics}
            </div>
          </div>
          <Toolbar />
        </div>
      </LocaleContext.Provider>
    </ThemeContext.Provider>
  );
};

export default Mindmap;
