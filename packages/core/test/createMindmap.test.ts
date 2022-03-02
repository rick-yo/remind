import { test, expect, beforeEach, afterEach } from 'vitest'
// @ts-expect-error import src file will throw error, see https://github.com/preactjs/preact/issues/2690
import { createMindmap, types } from '../dist/remind-core.es'

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
