import { TopicData } from 'xmind-model/types/models/topic';
import hierarchy, { Options, HierachyNode } from '@antv/hierarchy';
import {
  MIN_TOPIC_HEIGHT,
  canvasContext,
  MAX_TOPIC_WIDTH,
  TOPIC_FONT_SIZE,
  TOPIC_HORIZENTAL_MARGIN,
  TOPIC_FONT_FAMILY,
} from '../constant';
import produce from 'immer';
import { normalizeTopicDepth } from '../utils/tree';

declare module 'xmind-model/types/models/topic' {
  interface TopicData {
    side?: 'left' | 'right';
    depth?: number;
    parent?: TopicData;
  }
}

export function getTopicFontsize(node: TopicData) {
  const fontSizeOffset = node.depth || 0 * 5;
  const fontSize = `${Math.max(16, TOPIC_FONT_SIZE - fontSizeOffset)}`;
  return fontSize;
}

// FIXME fontSize is diffrent between topic, should fix this to get correct topic width and height
function measureText(node: TopicData) {
  const fontSize = getTopicFontsize(node);
  canvasContext.save();
  canvasContext.font = `${fontSize}px ${TOPIC_FONT_FAMILY}`;
  const measure = canvasContext.measureText(node.title);
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
    const width = measureText(node).width;
    const lines = Math.ceil(width / MAX_TOPIC_WIDTH);
    const contentHeight = Math.max(
      MIN_TOPIC_HEIGHT,
      TOPIC_FONT_SIZE * lines * 1.2
    );
    return contentHeight;
  },
  getWidth(node) {
    const measure = measureText(node);
    const contentWidth = Math.min(measure.width, MAX_TOPIC_WIDTH);
    return contentWidth;
  },
  getSubTreeSep() {
    return 10;
  },
  // left right padding
  getHGap() {
    return 20;
  },
  // top bottom padding
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
  // console.time('mindmap layout')
  const rootWithDepth = produce(root, normalizeTopicDepth);
  const rootNode = hierarchy.mindmap(rootWithDepth, options);
  // add left right margin
  rootNode.eachNode(node => {
    node.x +=
      node.depth *
      (node.side === 'right'
        ? TOPIC_HORIZENTAL_MARGIN
        : -TOPIC_HORIZENTAL_MARGIN);
  });
  // // move mindmap to canvas center
  const descendants: HierachyNode<TopicData>[] = [];
  rootNode.eachNode(node => descendants.push(node));
  // console.timeEnd('mindmap layout')
  return rootNode;
}
