import React, { FC } from 'react';
import Topic from './components/Topic';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constant';
import mindmap from './layout/mindmap';
import Link from './components/Link';
import { ThemeContext, defaultTheme } from './theme';
import { TopicData } from 'xmind-model/types/models/topic';
import { toJSON } from './store';

export interface XminderProps {
  theme?: any;
  root: TopicData;
}

const Xminder: FC<XminderProps> = ({ root, theme = defaultTheme }) => {
  const rootWithCoords = mindmap(root || toJSON());
  rootWithCoords.translate(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 3);
  const topics: React.ReactElement[] = [];
  const links: React.ReactElement[] = [];

  rootWithCoords.eachNode(node => {
    topics.push(<Topic key={node.id} {...node} />);
  });

  rootWithCoords.eachNode(node => {
    node.children.forEach(child => {
      links.push(<Link key={child.id} source={node} target={child} />);
    });
  });

  return (
    <ThemeContext.Provider value={theme}>
      <svg
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        xmlns="http://www.w3.org/2000/svg"
      >
        {topics}
        {links}
      </svg>
    </ThemeContext.Provider>
  );
};

export default Xminder;
