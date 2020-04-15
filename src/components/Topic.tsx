/** @jsx jsx */
import { FC, useContext, Fragment } from 'react';
import { ThemeContext } from '../theme';
import {
  MAX_TOPIC_WIDTH,
  TOPIC_RADIUS,
  TOPIC_FONT_SIZE,
  TOPIC_PADDING,
} from '../constant';
import { css, jsx } from '@emotion/core';
import { HierachyNode } from '@antv/hierarchy';
import { TopicData } from 'xmind-model/types/models/topic';

const paddings = TOPIC_PADDING * 2;
const Topic: FC<HierachyNode<TopicData>> = (props: HierachyNode<TopicData>) => {
  const {
    data: { title, contentWidth, contentHeight },
    x,
    y,
  } = props;
  const topicTheme = useContext(ThemeContext).topic;

  return (
    <Fragment>
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
      <foreignObject
        x={x}
        y={y}
        width={contentWidth + paddings}
        height={contentHeight + paddings}
      >
        <div
          // @ts-ignore
          xmlns="http://www.w3.org/1999/xhtml"
          css={css`
            display: inline-block;
            max-width: ${MAX_TOPIC_WIDTH}px;
            padding: ${TOPIC_PADDING}px;
            overflow-wrap: break-word;
            font-size: ${TOPIC_FONT_SIZE}px;
          `}
        >
          {title}
        </div>
      </foreignObject>
    </Fragment>
  );
};

export default Topic;
