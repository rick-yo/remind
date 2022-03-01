import { test, expect } from 'vitest'
import { createTopic, LayoutNode, TopicData } from '../src'
import { mindmap } from '../src/layout/mindmap'

const simpleRoot: TopicData = {
  ...createTopic('Central Topic'),
  children: [createTopic('main topic 1'), createTopic('main topic 2')],
}

const complexRoot: TopicData = {
  ...createTopic('Central Topic'),
  children: [
    createTopic('main topic 1'),
    createTopic('main topic 2'),
    createTopic('main topic 3'),
    createTopic('main topic 4', {
      children: [
        createTopic('sub topic 1'),
        createTopic('sub topic 2'),
        createTopic('sub topic 3'),
        createTopic('sub topic 4'),
        createTopic(
          'sub topic 5: 测试多行文字，测试多行文字，测试多行文字，测试多行文字，测试多行文字，测试多行文字，测试多行文字，测试多行文字，测试多行文字，测试多行文字，测试多行文字，测试多行文字，测试多行文字，测试多行文字，',
          {
            children: [
              createTopic('sub sub topic 1'),
              createTopic('sub sub topic 2'),
              createTopic('sub sub topic 3'),
              createTopic('sub sub topic 4'),
              createTopic(
                'sub sub topic 5: many text test,many text test,many text test,many text test,many text test,many text test,many text test,many text test,many text test,many text test,',
              ),
            ],
          },
        ),
      ],
    }),
  ],
}

test('simple data', () => {
  const { layoutRoot } = mindmap(simpleRoot)
  expectTreeFlowToRight(layoutRoot)
  expectNodesNotIntersect(layoutRoot)
})

test('complex data', () => {
  const { layoutRoot } = mindmap(complexRoot)
  expectTreeFlowToRight(layoutRoot)
  expectNodesNotIntersect(layoutRoot)
})

// Layout node should flow to right direction
function expectTreeFlowToRight(layoutRoot: LayoutNode) {
  let maxParentX = -1
  let currentDepth = -1
  let currentNodes: LayoutNode[] = []
  while (currentNodes.length > 0) {
    currentDepth++
    currentNodes = layoutRoot.descendants().filter((node) => {
      return node.depth === currentDepth
    })
    const rightOfParent = currentNodes.every((node) => {
      return node.x > maxParentX
    })
    expect(rightOfParent).toBe(true)
    maxParentX = Math.max(...currentNodes.map((node) => node.x))
  }
}

// Layout node should not intersects with each other
function expectNodesNotIntersect(layoutRoot: LayoutNode) {
  layoutRoot.descendants().forEach((a) => {
    layoutRoot.descendants().forEach((b) => {
      if (a.data.id !== b.data.id) {
        expect(!intersects(a, b)).toBe(true)
      }
    })
  })
}

function intersects(a: LayoutNode, b: LayoutNode) {
  const min_a_x = a.x
  const max_a_x = a.x + a.size[0]
  const min_a_y = a.y
  const max_a_y = a.y + a.size[1]

  const min_b_x = b.x
  const max_b_x = b.x + b.size[0]
  const min_b_y = b.y
  const max_b_y = b.y + b.size[1]

  const aLeftOfB = max_a_x < min_b_x
  const aRightOfB = min_a_x > max_b_x
  const aAboveB = min_a_y > max_b_y
  const aBelowB = max_a_y < min_b_y

  return !(aLeftOfB || aRightOfB || aAboveB || aBelowB)
}
