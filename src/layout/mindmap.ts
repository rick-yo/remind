import { TopicData } from 'xmind-model/types/models/topic';
import hierarchy, { Options, HierachyNode } from '@antv/hierarchy';
import {
  MIN_TOPIC_HEIGHT,
  canvasContext,
  MAX_TOPIC_WIDTH,
  TOPIC_FONT_SIZE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from '../constant';

// FIXME fontSize is diffrent between topic, should fix this to get correct topic width and height
function measureText(text: string, fontSize: number = TOPIC_FONT_SIZE) {
  canvasContext.save();
  canvasContext.font = `${fontSize}px System`;
  const measure = canvasContext.measureText(text);
  canvasContext.restore();
  return measure;
}

const defaultOptions: Options<TopicData> = {
  getId(node) {
    return node.id;
  },
  getHeight(node) {
    const width = measureText(node.title).width;
    const lines = Math.ceil(width / MAX_TOPIC_WIDTH);
    const contentHeight = Math.max(
      MIN_TOPIC_HEIGHT,
      TOPIC_FONT_SIZE * lines * 1.2
    );
    return contentHeight;
  },
  getWidth(node) {
    const measure = measureText(node.title);
    const contentWidth = Math.min(measure.width, MAX_TOPIC_WIDTH);
    console.log(node.title, contentWidth);
    return contentWidth;
  },
  getSubTreeSep(d) {
    if (!this.getChildren(d).length) {
      return 0;
    }
    return 20;
  },
  // 左右间距
  getHGap() {
    return 18;
  },
  // 上下间距
  getVGap() {
    return 12;
  },
  getChildren(node) {
    return node.children?.attached || [];
  },
};

export default function(
  root: TopicData,
  options: Options<TopicData> = defaultOptions
) {
  const rootNode = hierarchy.mindmap(root, options);
  rootNode.eachNode(node => {
    if (!node.parent) return;
    node.x += 70 * node.depth;
  });
  // move mindmap to canvas center
  const descendants: HierachyNode<TopicData>[] = [];
  rootNode.eachNode(node => descendants.push(node));
  const right = Math.max(...descendants.map(node => node.x));
  const bottom = Math.max(...descendants.map(node => node.y));
  rootNode.eachNode(node => {
    node.x += CANVAS_WIDTH / 2 - right / 2;
    node.y += CANVAS_HEIGHT / 2 - bottom / 2;
  });
  return rootNode;
}
