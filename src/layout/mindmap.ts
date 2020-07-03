import { TopicData } from 'xmind-model/types/models/topic';
import { hierarchy, tree } from 'd3-hierarchy';
import {
  canvasContext,
  TOPIC_FONT_SIZE,
  TOPIC_PADDING,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from '../constant';

function measureText(text: string, fontSize: number = TOPIC_FONT_SIZE) {
  canvasContext.save();
  canvasContext.font = `${fontSize}px System`;
  const measure = canvasContext.measureText(text);
  canvasContext.restore();
  return measure;
}

export default function(root: TopicData) {
  const rootNode = hierarchy(root, node => node.children?.attached);
  const treeLayout = tree<TopicData>();
  treeLayout.nodeSize([50, 200]);
  // calculate vertical margin between neighboring nodes
  treeLayout.separation((a, b) => {
    return a.parent == b.parent ? 1.5 : 1;
  });
  const mindmap = treeLayout(rootNode);
  // swap node.x, node.y
  mindmap.each(node => {
    // @ts-ignore
    node.id = node.data.id;
    const tempx = node.x;
    node.x = node.y;
    node.y = tempx;
  });

  // calculate horizontal margin between neighboring nodes
  mindmap.each(node => {
    node.x += node.depth * TOPIC_PADDING * 4;
  });
  // move mindmap to canvas center
  const descendants = mindmap.descendants();
  const right = Math.max(...descendants.map(node => node.x));
  const bottom = Math.max(...descendants.map(node => node.y));
  mindmap.each(node => {
    node.x += CANVAS_WIDTH / 2 - right / 2;
    node.y += CANVAS_HEIGHT / 2 - bottom / 2;
  });
  return mindmap;
}
