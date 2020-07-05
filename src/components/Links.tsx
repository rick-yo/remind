import React, { useContext } from 'react';
import { ThemeContext } from '../context/theme';
import { HierachyNodeWithTopicData } from 'utils/tree';

interface LinksProps {
  mindmap: HierachyNodeWithTopicData;
}

const Links = (props: LinksProps) => {
  const { mindmap } = props;
  const linkTheme = useContext(ThemeContext).link;
  const links: string[] = [];

  mindmap.eachNode(node => {
    if (node.depth === 0) {
      node.children?.forEach(child => {
        const x1 = node.x + node.width * 0.8;
        const y1 = node.y + node.height / 2;
        const x2 = x1 + (child.x - x1) * 0.8;
        const y2 = child.y + child.height / 2;
        const x3 = child.x;
        const y3 = y2;
        links.push(`${x1},${y1} ${x2},${y2} ${x3},${y3}`);
      });
      return;
    }
    node.children?.forEach(child => {
      const x1 = node.x + node.width;
      const y1 = node.y + node.height / 2;
      const x2 = x1 + (child.x - x1) * 0.2;
      const y2 = y1;
      const x3 = child.x;
      const y3 = child.y + child.height / 2;
      links.push(`${x1},${y1} ${x2},${y2} ${x3},${y3}`);
    });
  });
  return (
    <g>
      {links.map(link => {
        return (
          <polyline
            key={link}
            points={link}
            fill="transparent"
            stroke={linkTheme.stroke}
            strokeWidth={linkTheme.strokeWidth}
          ></polyline>
        );
      })}
    </g>
  );
};

export default Links;
