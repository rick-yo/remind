/** @jsx jsx */
import { FC, useContext, Fragment, SyntheticEvent, KeyboardEvent } from 'react';
import { ThemeContext } from '../theme';
import {
  MAX_TOPIC_WIDTH,
  TOPIC_RADIUS,
  TOPIC_FONT_SIZE,
  TOPIC_PADDING,
  EDITOR_MODE,
  TOPIC_BORDER,
  KEY_MAPS,
} from '../constant';
import { css, jsx } from '@emotion/core';
import { HierachyNode } from '@antv/hierarchy';
import { TopicData } from 'xmind-model/types/models/topic';
import * as rootStore from '../store/root';
import editorStore from '../store/editor';

const paddings = TOPIC_PADDING * 2;
const Topic: FC<HierachyNode<TopicData>> = (props: HierachyNode<TopicData>) => {
  const {
    data: { title, contentWidth, contentHeight, id },
    x,
    y,
    depth,
  } = props;
  const topicTheme = useContext(ThemeContext).topic;
  const root = rootStore.useSelector(s => s);
  const editorState = editorStore.useSelector(s => s);
  const { mode, selectedNodeId } = editorState;
  const isSelected = id === selectedNodeId;
  const isEditing = isSelected && mode === EDITOR_MODE.edit;
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

  return (
    <g id="topic" onClick={selectNode} pointerEvents="all">
      {hasBorder && (
        <rect
          x={x}
          y={y}
          width={contentWidth + paddings}
          height={contentHeight + paddings}
          rx={TOPIC_RADIUS}
          ry={TOPIC_RADIUS}
          stroke={topicTheme.stroke}
          fill="white"
        ></rect>
      )}
      {isSelected && (
        <rect
          x={x - TOPIC_BORDER / 2}
          y={y - TOPIC_BORDER / 2}
          width={contentWidth + paddings + TOPIC_BORDER}
          height={contentHeight + paddings + TOPIC_BORDER}
          rx={TOPIC_RADIUS}
          ry={TOPIC_RADIUS}
          stroke={topicTheme.borderColor}
          fill="transparent"
        ></rect>
      )}
      <foreignObject
        x={x}
        y={y}
        width={contentWidth + paddings}
        height={contentHeight + paddings}
      >
        <div
          // @ts-ignore
          xmlns="http://www.w3.org/1999/xhtml"
          id={`topic-content-${id}`}
          css={css`
            display: inline-block;
            max-width: ${MAX_TOPIC_WIDTH}px;
            padding: ${TOPIC_PADDING}px;
            overflow-wrap: break-word;
            font-size: ${TOPIC_FONT_SIZE}px;
            cursor: default;
            user-select: none;
          `}
          contentEditable={isEditing}
          onKeyUp={exitEditMode}
        >
          {title}
        </div>
      </foreignObject>
    </g>
  );
};

export default Topic;
