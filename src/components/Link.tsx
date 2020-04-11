import React, { FC, useContext } from 'react'
import { HierachyNode } from '@antv/hierarchy'
import { ThemeContext } from '../theme';

interface LinkProps {
  source: HierachyNode<any>;
  target: HierachyNode<any>;
}

const Link: FC<LinkProps> = (props: LinkProps) => {
  const { source, target } = props;
  const { x: x1, y: y1 } = source;
  const { x: x2, y: y2 } = target;
  const linkTheme = useContext(ThemeContext).link;
  
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={linkTheme.stroke}></line>
  )
}

export default Link
