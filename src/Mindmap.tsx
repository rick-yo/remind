/** @jsx jsx */
import {
  useEffect,
  ReactElement,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import Topic from './components/Topic';
import {
  EDITOR_MODE,
  EDITOR_ID,
  TOPIC_FONT_FAMILY,
  CORE_EDITOR_ID,
  TOPIC_CLASS,
  HOTKEYS,
  TOPIC_HORIZENTAL_MARGIN,
} from './constant';
import mindmap from './layout/mindmap';
import Links from './components/Links';
import * as rootStore from './store/root';
import editorStore from './store/editor';
import hotkeys from 'hotkeys-js';
import { createTopic } from './utils/tree';
import { debug } from './utils/debug';
import {
  selectText,
  useIconFont,
  useClickOutSide,
  usePassiveWheelEvent,
} from './utils/dom';
import { css, jsx } from '@emotion/core';
import Toolbar from './components/Toolbar';
import { useLocale } from './context/locale';
import { ThemeContext } from './context/theme';

const Mindmap = () => {
  const root = rootStore.useSelector(s => s);
  const editorState = editorStore.useSelector(s => s);
  const theme = useContext(ThemeContext);
  const { scale, translate } = editorState;
  const { mode, selectedNodeId } = editorState;
  const { canvasWidth, canvasHeight } = theme;
  const mindMap = mindmap(root);
  // move mindmap to canvas central positon
  mindMap.eachNode(node => {
    node.x += canvasWidth / 2 - TOPIC_HORIZENTAL_MARGIN;
    node.y += canvasHeight / 2;
  });
  const locale = useLocale();
  const editorRef = useRef<HTMLDivElement>(null);
  const hotkeyOptions = {
    element: editorRef.current,
  };
  useIconFont();

  const id = `#topic-${selectedNodeId}`;
  const topics: ReactElement[] = useMemo(() => {
    const nodes: ReactElement[] = [];
    mindMap.eachNode(node => {
      nodes.push(<Topic key={node.data.id} {...node} />);
    });
    return nodes;
  }, [mindMap]);

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

    if (mode === EDITOR_MODE.regular) {
      hotkeys(HOTKEYS.tab, hotkeyOptions, appendChild);
      hotkeys(HOTKEYS.space, hotkeyOptions, editTopic);
      hotkeys(HOTKEYS.backspace, hotkeyOptions, deleteNode);
    }
    return () => {
      hotkeys.unbind(HOTKEYS.tab, appendChild);
      hotkeys.unbind(HOTKEYS.space, editTopic);
      hotkeys.unbind(HOTKEYS.backspace, deleteNode);
    };
  }, [mode, selectedNodeId, id, locale.subTopic, hotkeyOptions]);

  // regular mode, bind navigate shortcut
  useEffect(() => {
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
    if (mode === EDITOR_MODE.regular) {
      hotkeys(HOTKEYS.left, hotkeyOptions, moveLeft);
      hotkeys(HOTKEYS.right, hotkeyOptions, moveRight);
      hotkeys(HOTKEYS.up, hotkeyOptions, moveTop);
      hotkeys(HOTKEYS.down, hotkeyOptions, moveDown);
    }
    return () => {
      hotkeys.unbind(HOTKEYS.left, moveLeft);
      hotkeys.unbind(HOTKEYS.right, moveRight);
      hotkeys.unbind(HOTKEYS.up, moveTop);
      hotkeys.unbind(HOTKEYS.down, moveDown);
    };
  }, [mindMap, hotkeyOptions, mode]);

  // regular mode, bind undo redo shortcut
  useEffect(() => {
    function undo() {
      rootStore.dispatch('UNDO_HISTORY');
    }

    function redo() {
      rootStore.dispatch('REDO_HISTORY');
    }
    if (mode === EDITOR_MODE.regular) {
      hotkeys(HOTKEYS.undo, hotkeyOptions, undo);
      hotkeys(HOTKEYS.redo, hotkeyOptions, redo);
    }
    return () => {
      hotkeys.unbind(HOTKEYS.undo, undo);
      hotkeys.unbind(HOTKEYS.redo, redo);
    };
  }, [hotkeyOptions, mode]);

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

  const handleWheel = useCallback(
    throttle((e: WheelEvent) => {
      e.stopPropagation();
      e.preventDefault();
      editorStore.dispatch('SET_TRANSLATE', [
        translate[0] - e.deltaX,
        translate[1] - e.deltaY,
      ]);
    }, 30),
    [translate]
  );

  usePassiveWheelEvent(editorRef, handleWheel);

  debug('rootWithCoords', mindMap);
  return (
    <div
      ref={editorRef}
      id={EDITOR_ID}
      css={css`
        position: relative;
        font-family: ${TOPIC_FONT_FAMILY};
        background: #eef8fa;
        width: ${canvasWidth}px;
        height: ${canvasHeight}px;
        overflow: hidden;
      `}
    >
      <div
        id={CORE_EDITOR_ID}
        css={css`
          position: relative;
          transform: scale(${scale}, ${scale});
          translate: ${translate[0]}px ${translate[1]}px;
          transition: all 0.2s;
          background: #eef8fa;
        `}
      >
        <svg
          width={canvasWidth}
          height={canvasHeight}
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

function throttle(fn: Function, wait: number) {
  let isCalled = false;

  return function(...args: any[]) {
    if (!isCalled) {
      fn(...args);
      isCalled = true;
      setTimeout(function() {
        isCalled = false;
      }, wait);
    }
  };
}
