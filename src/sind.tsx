/** @jsx jsx */
import React, { FC, useEffect } from 'react';
import Topic from './components/Topic';
import { CANVAS_WIDTH, CANVAS_HEIGHT, EDITOR_MODE } from './constant';
import mindmap from './layout/mindmap';
import Link from './components/Link';
import { ThemeContext, defaultTheme } from './context/theme';
import * as rootStore from './store/root';
import editorStore from './store/editor';
import hotkeys from 'hotkeys-js';
import { createTopic } from './utils/tree';
import { debug } from './utils/debug';
import { selectText, onClickOutSide } from './utils/dom';
import { css, jsx } from '@emotion/core';
import { LocaleContext, defaultLocale } from './context/locale';
import Header from './components/Header';
import { IntlKey } from './utils/Intl';

export interface SindProps {
  theme?: typeof defaultTheme;
  locale?: IntlKey;
}

const Sind: FC<SindProps> = ({
  theme = defaultTheme,
  locale = defaultLocale.locale,
}) => {
  const root = rootStore.useSelector(s => s);
  const editorState = editorStore.useSelector(s => s);
  const { mode, selectedNodeId } = editorState;
  const rootWithCoords = mindmap(root);

  const id = `#topic-${selectedNodeId}`;
  const topics: React.ReactElement[] = [];
  const links: React.ReactElement[] = [];

  rootWithCoords.each(node => {
    topics.push(<Topic key={node.data.id} {...node} />);
  });

  rootWithCoords.each(node => {
    node.children?.forEach(child => {
      links.push(<Link key={child.data.id} source={node} target={child} />);
    });
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
      editorStore.dispatch('MOVE_TOP', rootWithCoords);
    }
    function moveDown(e: KeyboardEvent) {
      e.preventDefault();
      editorStore.dispatch('MOVE_DOWN', rootWithCoords);
    }
    function moveLeft(e: KeyboardEvent) {
      e.preventDefault();
      editorStore.dispatch('MOVE_LEFT', rootWithCoords);
    }
    function moveRight(e: KeyboardEvent) {
      e.preventDefault();
      editorStore.dispatch('MOVE_RIGHT', rootWithCoords);
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
  }, [mode, selectedNodeId, id, rootWithCoords]);

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

  debug('rootWithCoords', rootWithCoords);
  return (
    <ThemeContext.Provider value={theme}>
      <LocaleContext.Provider value={{ locale }}>
        <div
          id="editor"
          css={css`
            font-family: 微软雅黑, -apple-system;
          `}
        >
          <Header />
          <div
            id="core-editor"
            style={{
              position: 'relative',
            }}
          >
            <svg
              id="sind-links"
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              xmlns="http://www.w3.org/2000/svg"
              css={css`
                position: absolute;
                left: 0;
                top: 0;
              `}
            >
              {links}
            </svg>
            <div
              id="sind-topics"
              style={{
                width: `${CANVAS_WIDTH}px`,
                height: `${CANVAS_HEIGHT}px`,
                position: 'relative',
                zIndex: 1,
              }}
            >
              {topics}
            </div>
          </div>
        </div>
      </LocaleContext.Provider>
    </ThemeContext.Provider>
  );
};

export default Sind;
