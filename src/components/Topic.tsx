/** @jsx jsx */
import { FC, useContext, KeyboardEvent, useState, DragEvent } from 'react';
import { ThemeContext } from '../theme';
import {
  MAX_TOPIC_WIDTH,
  TOPIC_RADIUS,
  TOPIC_FONT_SIZE,
  TOPIC_PADDING,
  EDITOR_MODE,
  KEY_MAPS,
} from '../constant';
import { css, jsx } from '@emotion/core';
import { HierachyNode } from '@antv/hierarchy';
import { TopicData } from 'xmind-model/types/models/topic';
import * as rootStore from '../store/root';
import editorStore from '../store/editor';
import { debug } from '../utils/debug';

declare module 'xmind-model/types/models/topic' {
  interface TopicData {
    contentWidth: number;
    contentHeight: number;
  }
}

const Topic: FC<HierachyNode<TopicData>> = (props: HierachyNode<TopicData>) => {
  const {
    data: { title, id },
    x,
    y,
    depth,
  } = props;
  const topicTheme = useContext(ThemeContext).topic;
  // const root = rootStore.useSelector(s => s);
  const editorState = editorStore.useSelector(s => s);
  const { mode, selectedNodeId } = editorState;
  const isSelected = id === selectedNodeId;
  const isEditing = isSelected && mode === EDITOR_MODE.edit;
  const [isDragEntering, setIsDragEntering] = useState(false);
  const hasBorder = depth <= 1;

  function selectNode() {
    editorStore.dispatch('SELECT_NODE', id);
  }

  // 编辑模式下
  function exitEditMode(e: KeyboardEvent<HTMLDivElement>) {
    e.persist();

    if (
      [KEY_MAPS.Enter, KEY_MAPS.Escape].includes(e.key) &&
      mode === EDITOR_MODE.edit
    ) {
      editorStore.dispatch('SET_MODE', EDITOR_MODE.regular);
      rootStore.dispatch('UPDATE_NODE', {
        id,
        node: {
          title: e.currentTarget.innerText,
        },
      });
    }
  }

  function handleDragStart() {
    editorStore.dispatch('DRAG_NODE', props.data);
  }
  function handleDragEnter() {
    setIsDragEntering(true);
  }
  function handleDragLeave() {
    setIsDragEntering(false);
  }

  function handleDrop() {
    debug('handleDrop');
    rootStore.dispatch('DELETE_NODE', editorState.dragingNode?.id)
    rootStore.dispatch('APPEND_CHILD', {
      id,
      node: editorState.dragingNode,
    });
  }
  
  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }
  const border = hasBorder ? `1px solid ${topicTheme.stroke}` : 'none';
  const outsideBorder = isSelected
    ? `2px solid ${topicTheme.borderColor}`
    : 'none';
  return (
    <div
      id="topic"
      onClick={selectNode}
      draggable
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      css={css`
        display: inline-block;
        border: ${outsideBorder};
        border-radius: ${TOPIC_RADIUS}px;
        padding: 1px 2px;
        position: absolute;
        top: 0;
        left: 0;
        transform: translate(${x}px, ${y}px);
      `}
    >
      <div
        id={`topic-content-${id}`}
        css={css`
          display: inline-block;
          max-width: ${MAX_TOPIC_WIDTH}px;
          padding: ${TOPIC_PADDING}px;
          overflow-wrap: break-word;
          font-size: ${TOPIC_FONT_SIZE}px;
          cursor: default;
          user-select: none;
          opacity: ${isDragEntering ? 0.7 : 1};
          border: ${border};
          border-radius: ${TOPIC_RADIUS}px;
        `}
        contentEditable={isEditing}
        onKeyUp={exitEditMode}
      >
        {title}
      </div>
    </div>
  );
};

export default Topic;
