import React, { FC, useContext } from 'react';
import { HierachyNode } from '@antv/hierarchy';
import { ThemeContext } from '../theme';
import { TopicData } from 'xmind-model/types/models/topic';

interface LinkProps {
  source: HierachyNode<TopicData>;
  target: HierachyNode<TopicData>;
}

const Link: FC<LinkProps> = (props: LinkProps) => {
  const { source, target } = props;
  const { x: x1, y: y1 } = source;
  const { x: x2, y: y2 } = target;
  const linkTheme = useContext(ThemeContext).link;

  return (
    <line
      x1={x1 + source.width}
      y1={y1 + source.height / 2}
      x2={x2}
      y2={y2 + target.height / 2}
      stroke={linkTheme.stroke}
    ></line>
  );
};

export default Link;
