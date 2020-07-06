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

declare module 'xmind-model/types/models/topic' {
  interface TopicData {
    side?: 'left' | 'right';
  }
}

// FIXME fontSize is diffrent between topic, should fix this to get correct topic width and height
function measureText(text: string, fontSize: number = TOPIC_FONT_SIZE) {
  canvasContext.save();
  canvasContext.font = `${fontSize}px System`;
  const measure = canvasContext.measureText(text);
  canvasContext.restore();
  return measure;
}

const defaultOptions: Options<TopicData> = {
  direction: 'H',
  getSide(node) {
    // FIXME fix type
    // @ts-ignore
    return node.data.side || 'right';
  },
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
    return 30;
  },
  // 上下间距
  getVGap() {
    return 20;
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
  // // move mindmap to canvas center
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
