import { v4 as uuidv4 } from 'uuid';
import { TopicData } from 'xmind-model/types/models/topic';
import { HierachyNode } from '@antv/hierarchy';

export type HierachyNodeWithTopicData = HierachyNode<TopicData>;
type UnionNode = HierachyNodeWithTopicData | TopicData;

interface ChildrenFn<T> {
  (node: T): T[] | undefined;
}

const defaultChildren = (node: HierachyNodeWithTopicData) => {
  return node.children;
};

class TreeWalker<T extends UnionNode> {
  children: ChildrenFn<T>;
  constructor(children: ChildrenFn<T>) {
    this.children = children;
  }
  getNode(root: T, id: string): T | null {
    let target: T | null = null;
    this.eachBefore(root, node => {
      if (node.id === id) target = node;
    });
    return target;
  }

  getParentNode(root: T, id: string): T | undefined {
    let target: T | undefined = undefined;
    this.eachBefore(root, node => {
      if (!Array.isArray(this.children(node))) return;
      if (this.children(node)?.some(item => item.id === id)) target = node;
    });
    return target;
  }

  getPreviousNode(root: T, id: string): T | undefined {
    const parent = this.getParentNode(root, id);
    const children = this.children(parent as T);
    if (parent && children) {
      const index = children.findIndex(node => node.id === id);
      return children[index - 1];
    }
    return undefined;
  }

  getNextNode(root: T, id: string): T | undefined {
    const parent = this.getParentNode(root, id);
    const children = this.children(parent as T);
    if (parent && children) {
      const index = children.findIndex(node => node.id === id);
      return children[index + 1];
    }
    return undefined;
  }

  eachBefore(node: T, callback: (node: T) => void) {
    let nodes = [node],
      children,
      i;
    // @ts-ignore
    while ((node = nodes.pop())) {
      // @ts-ignore
      callback(node);
      children = this.children(node);
      if (children) {
        for (i = children.length - 1; i >= 0; --i) {
          nodes.push(children[i] as T);
        }
      }
    }
  }
}

export const defaultWalker = new TreeWalker<HierachyNodeWithTopicData>(
  defaultChildren
);
export const topicWalker = new TreeWalker<TopicData>(
  node => node.children?.attached
);

function getDistance(
  a: HierachyNodeWithTopicData,
  b: HierachyNodeWithTopicData
) {
  const xDiff = Math.abs(a.x - b.x);
  const yDiff = Math.abs(a.y - b.y);
  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
}

function getClosedNode(
  array: HierachyNodeWithTopicData[],
  target: HierachyNodeWithTopicData
): HierachyNodeWithTopicData | undefined {
  if (!array.length) return undefined;
  return array.reduce<HierachyNodeWithTopicData | undefined>((prev, curr) => {
    if (!prev) {
      prev = curr;
    }
    return getDistance(target, curr) < getDistance(target, prev) ? curr : prev;
  }, undefined);
}

export function getLeftNode(
  root: HierachyNodeWithTopicData,
  currentId: string
) {
  const array: HierachyNodeWithTopicData[] = [];
  const currentNode = defaultWalker.getNode(root, currentId);
  if (!currentNode) return undefined;
  defaultWalker.eachBefore(root, node => {
    if (node.x < currentNode.x) {
      array.push(node);
    }
  });
  return getClosedNode(array, currentNode);
}

export function getRighttNode(
  root: HierachyNodeWithTopicData,
  currentId: string
) {
  const array: HierachyNodeWithTopicData[] = [];
  const currentNode = defaultWalker.getNode(root, currentId);
  if (!currentNode) return undefined;
  defaultWalker.eachBefore(root, node => {
    if (node.x > currentNode.x) {
      array.push(node);
    }
  });
  return getClosedNode(array, currentNode);
}

export function getTopNode(root: HierachyNodeWithTopicData, currentId: string) {
  const array: HierachyNodeWithTopicData[] = [];
  const currentNode = defaultWalker.getNode(root, currentId);
  if (!currentNode) return undefined;
  defaultWalker.eachBefore(root, node => {
    if (node.y < currentNode.y) {
      array.push(node);
    }
  });
  return getClosedNode(array, currentNode);
}

export function getBottomNode(
  root: HierachyNodeWithTopicData,
  currentId: string
) {
  const array: HierachyNodeWithTopicData[] = [];
  const currentNode = defaultWalker.getNode(root, currentId);
  if (!currentNode) return undefined;
  defaultWalker.eachBefore(root, node => {
    if (node.y > currentNode.y) {
      array.push(node);
    }
  });
  return getClosedNode(array, currentNode);
}

export function createTopic(title: string, options: Partial<TopicData> = {}) {
  const topic: TopicData = {
    ...options,
    id: uuidv4(),
    title,
  };
  return topic;
}
