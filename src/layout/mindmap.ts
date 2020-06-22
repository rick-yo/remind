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
    if (!d.children || !d.children.length) {
      return 0;
    }
    return TOPIC_PADDING;
  },
  // 左右间距
  getHGap() {
    return TOPIC_PADDING * 1.5;
  },
  // 上下间距
  getVGap() {
    return TOPIC_PADDING;
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
