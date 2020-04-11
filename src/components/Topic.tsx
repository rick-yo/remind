import React, { FC, useContext, Fragment } from 'react';
import { ThemeContext } from '../theme';

interface TopicProps {
  title: string;
  x: number | string;
  y: number | string;
}

const Topic: FC<TopicProps> = (props: TopicProps) => {
  const { title, x, y } = props;
  const topicTheme = useContext(ThemeContext).topic;
  return (
    <Fragment>
      <text x={x} y={y} fill="black">
        {title}
      </text>
      <rect
        x={x}
        y={y}
        rx={topicTheme.rx}
        ry={topicTheme.ry}
        width={200}
        height={200}
        stroke={topicTheme.stroke}
        fill="white"
      ></rect>
    </Fragment>
  );
};

export default Topic;
