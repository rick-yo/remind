import { v4 as uuidv4 } from 'uuid';
import { TopicData } from 'xmind-model/types/models/topic';

export function findNode(root: TopicData, id: string): TopicData | undefined {
  let target: TopicData | undefined
  eachBefore(root, node => {
    if (node.id === id) target = node
  })
  return target
}

export function findNodeParent(root: TopicData, id: string): TopicData | undefined {
  let target: TopicData | undefined
  eachBefore(root, node => {
    if (!Array.isArray(node.children?.attached)) return
    if (node.children?.attached.some(item => item.id === id)) target = node
  })
  return target
}

export function findPreviousSibling(root: TopicData, id: string): TopicData | undefined {
  const parent = findNodeParent(root, id);
  const children = parent?.children?.attached;
  if (parent && children) {
    const index = children.findIndex(node => node.id === id);
    return children[index - 1];
  }
  return undefined;
}

export function findNextSibling(root: TopicData, id: string): TopicData | undefined {
  const parent = findNodeParent(root, id);
  const children = parent?.children?.attached;
  if (parent && children) {
    const index = children.findIndex(node => node.id === id);
    return children[index + 1];
  }
  return undefined;
}

export function eachBefore(node: TopicData, callback: (node: TopicData) => void) {
  // tslint:disable-next-line
  let nodes = [node],
    children,
    i
  // @ts-ignore
  // tslint:disable-next-line: no-parameter-reassignment
  // tslint:disable-next-line: no-conditional-assignment
  while ((node = nodes.pop())) {
    // @ts-ignore
    callback(node), (children = node.children?.attached)
    if (children) {
      for (i = children.length - 1; i >= 0; --i) {
        nodes.push(children[i])
      }
    }
  }
}

export function createTopic(title: string, options: Partial<TopicData> = {}) {
  const topic: TopicData = {
    contentWidth: 0,
    contentHeight: 0,
    ...options,
    id: uuidv4(),
    title,
  }
  return topic;
}