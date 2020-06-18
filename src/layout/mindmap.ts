import { TopicData } from 'xmind-model/types/models/topic';
import hierarchy, { Options } from '@antv/hierarchy';
import {
  MIN_TOPIC_HEIGHT,
  canvasContext,
  MAX_TOPIC_WIDTH,
  TOPIC_PADDING,
  TOPIC_FONT_SIZE,
} from '../constant';

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
      TOPIC_FONT_SIZE * 1.4 * lines
    );
    node.contentHeight = contentHeight;
    return contentHeight;
  },
  getWidth(node) {
    const measure = measureText(node.title);
    const contentWidth = Math.min(measure.width, MAX_TOPIC_WIDTH);
    node.contentWidth = contentWidth;
    return contentWidth;
  },
  getSubTreeSep(d) {
    if (!d.children || !d.children.length) {
      return 0;
    }
    return TOPIC_PADDING;
  },
  getHGap() {
    return TOPIC_PADDING;
  },
  getVGap() {
    return TOPIC_PADDING * 2;
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
  return rootNode;
}
