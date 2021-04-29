/** @jsx jsx */
import {
  useEffect,
  ReactElement,
  useRef,
  useCallback,
  useMemo,
  useContext,
  memo,
  useState,
  MouseEvent,
  TouchEvent,
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
import { useRootSelector, RootStore } from './store/root';
import EditorStore from './store/editor';
import hotkeys from 'hotkeys-js';
import { createTopic } from './utils/tree';
import { debug } from './utils/debug';
import {
  selectText,
  useIconFont,
  useClickOutSide,
  usePassiveWheelEvent,
} from './utils/dom';
import { css, jsx } from '@emotion/react';
import Toolbar from './components/Toolbar';
import { useLocale } from './context/locale';
import { ThemeContext } from './context/theme';

const Mindmap = () => {
  const root = useRootSelector((s) => s);
  const rootStore = RootStore.useContainer();
  const editorStore = EditorStore.useContainer();
  const theme = useContext(ThemeContext);
  const { scale, translate, mode, selectedNodeId } = editorStore;
  const id = `#topic-${selectedNodeId}`;
  const { canvasWidth, canvasHeight } = theme;
  const mindMap = useMemo(() => {
    const map = mindmap(root);
    // move mindmap to canvas central positon
    map.eachNode((node) => {
      node.x += canvasWidth / 2 - TOPIC_HORIZENTAL_MARGIN;
      node.y += canvasHeight / 2;
    });
    return map;
  }, [root, canvasWidth, canvasHeight]);

  const locale = useLocale();
  const editorRef = useRef<HTMLDivElement>(null);
  const hotkeyOptions = {
    element: editorRef.current,
  };
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchPosition, setLastTouchPosition] = useState([0, 0]);
  useIconFont();

  const topics: ReactElement[] = useMemo(() => {
    const nodes: ReactElement[] = [];
    mindMap.eachNode((node) => {
      nodes.push(<Topic key={node.data.id} {...node} />);
    });
    return nodes;
  }, [mindMap]);

  // regular mode
  useEffect(() => {
    function appendChild(e: KeyboardEvent) {
      e.preventDefault();
      if (!selectedNodeId) return;
      rootStore.APPEND_CHILD(selectedNodeId, createTopic(locale.subTopic));
    }

    function editTopic(e: KeyboardEvent) {
      e.preventDefault();
      if (!selectedNodeId) return;
      const el = document.querySelector<HTMLDivElement>(id);
      el?.focus();
      selectText(el as HTMLDivElement);
      editorStore.SET_MODE(EDITOR_MODE.edit);
    }

    function deleteNode() {
      rootStore.DELETE_NODE(selectedNodeId);
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
  }, [
    mode,
    selectedNodeId,
    id,
    locale.subTopic,
    hotkeyOptions,
    rootStore,
    editorStore,
  ]);

  // regular mode, bind navigate shortcut
  useEffect(() => {
    function moveTop(e: KeyboardEvent) {
      e.preventDefault();
      editorStore.MOVE_TOP(mindMap);
    }
    function moveDown(e: KeyboardEvent) {
      e.preventDefault();
      editorStore.MOVE_DOWN(mindMap);
    }
    function moveLeft(e: KeyboardEvent) {
      e.preventDefault();
      editorStore.MOVE_LEFT(mindMap);
    }
    function moveRight(e: KeyboardEvent) {
      e.preventDefault();
      editorStore.MOVE_RIGHT(mindMap);
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
  }, [mindMap, hotkeyOptions, mode, editorStore]);

  // regular mode, bind undo redo shortcut
  useEffect(() => {
    function undo() {
      rootStore.UNDO_HISTORY();
    }

    function redo() {
      rootStore.REDO_HISTORY();
    }
    if (mode === EDITOR_MODE.regular) {
      hotkeys(HOTKEYS.undo, hotkeyOptions, undo);
      hotkeys(HOTKEYS.redo, hotkeyOptions, redo);
    }
    return () => {
      hotkeys.unbind(HOTKEYS.undo, undo);
      hotkeys.unbind(HOTKEYS.redo, redo);
    };
  }, [hotkeyOptions, mode, rootStore]);

  // edit mode
  useClickOutSide(
    id,
    () => {
      if (mode !== EDITOR_MODE.edit) return;
      if (!selectedNodeId) return;
      editorStore.SET_MODE(EDITOR_MODE.regular);
      const el = document.querySelector<HTMLDivElement>(id);
      rootStore.UPDATE_NODE(selectedNodeId, {
        title: el?.innerText,
      });
    },
    [mode, selectedNodeId, editorStore]
  );

  useClickOutSide(
    id,
    (e) => {
      if (!selectedNodeId) return;
      // @ts-ignore
      const isTopic = e.target?.closest(`.${TOPIC_CLASS}`);
      if (isTopic) return;
      editorStore.SELECT_NODE('');
    },
    [selectedNodeId, editorStore]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.stopPropagation();
      e.preventDefault();
      editorStore.SET_TRANSLATE([
        translate[0] - e.deltaX,
        translate[1] - e.deltaY,
      ]);
    },
    [translate, editorStore]
  );

  usePassiveWheelEvent(editorRef, handleWheel);

  // select root topic after initial render
  useEffect(() => {
    setTimeout(() => {
      editorStore.SELECT_NODE(root.id);
    }, 200);
  }, [root.id]);

  debug('rootStore', rootStore);

  const handleDragStart = useCallback(() => {
    setLastTouchPosition([0, 0]);
    setIsDragging(true);
  }, []);

  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      editorStore.SET_TRANSLATE([
        translate[0] + e.movementX,
        translate[1] + e.movementY,
      ]);
    },
    [isDragging, translate, editorStore]
  );

  const handleTouchDrag = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      const lastTouch = e.changedTouches[e.changedTouches.length - 1];
      if (!lastTouchPosition[0] && !lastTouchPosition[1]) {
        setLastTouchPosition([lastTouch.clientX, lastTouch.clientY]);
        return;
      }
      const deltaX = lastTouch.clientX - lastTouchPosition[0];
      const deltaY = lastTouch.clientY - lastTouchPosition[1];
      editorStore.SET_TRANSLATE([translate[0] + deltaX, translate[1] + deltaY]);
      setLastTouchPosition([lastTouch.clientX, lastTouch.clientY]);
    },
    [isDragging, lastTouchPosition, translate, editorStore]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setLastTouchPosition([0, 0]);
  }, []);
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
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onMouseMove={handleDrag}
      onTouchMove={handleTouchDrag}
      onMouseUp={handleDragEnd}
      onTouchEnd={handleDragEnd}
    >
      <div
        id={CORE_EDITOR_ID}
        css={css`
          position: relative;
          transform: scale(${scale}, ${scale})
            translate(${translate[0]}px, ${translate[1]}px);
          transition: all 0.2s;
          background: #eef8fa;
        `}
      >
        <svg
          width={10000}
          height={10000}
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

export default memo(Mindmap);
