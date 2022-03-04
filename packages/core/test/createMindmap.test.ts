import type { RefObject } from 'preact'
import { test, expect, beforeEach, afterEach, fn } from 'vitest'
// @ts-expect-error import src file will throw error, see https://github.com/preactjs/preact/issues/2690
import { createMindmap, types, createTopic } from '../dist/remind-core.es'
import type { ContributionAPI } from '../src'

const root = {
  ...createTopic('Central Topic test'),
  children: [createTopic('main topic 1'), createTopic('main topic 2')],
}

let container: HTMLDivElement

beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
})

afterEach(() => {
  container.remove()
})

test('should render mindmap', async () => {
  createMindmap(container)
  expect(types.isMindmap(container.children[0])).toBe(true)
})

test('should render value', async () => {
  const editorInstance: RefObject<ContributionAPI> = createMindmap(container, {
    value: root,
  })
  expect(editorInstance.current?.model.root).equal(root)
  expect(
    editorInstance.current?.view.current?.innerHTML.includes(root.title),
  ).toBeTruthy()
})

test('should onChange work', async () => {
  expect.hasAssertions()
  const onChange = fn(() => null)
  const editorInstance: RefObject<ContributionAPI> = createMindmap(container, {
    onChange,
  })
  editorInstance.current?.model.update((model) => {
    model.root.title = 'test'
  })
  await delay(1000)
  expect(onChange.mock.calls.length).toBe(1)
})

async function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ms)
    }, ms)
  })
}
