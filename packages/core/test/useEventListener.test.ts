import { renderHook } from '@testing-library/preact-hooks'
import { test, expect, beforeEach, afterEach } from 'vitest'
import { useEventListener } from '../src'

let container: HTMLDivElement

beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
})

afterEach(() => {
  container.remove()
})

test('test on click listener', async () => {
  let state = 0
  const onClick = () => {
    state++
  }

  const { rerender, unmount } = renderHook(() => {
    useEventListener('click', onClick, { target: { current: container } })
  })

  document.body.click()
  expect(state).toEqual(0)
  rerender()
  container.click()
  expect(state).toEqual(1)
  unmount()
  document.body.click()
  expect(state).toEqual(1)
})
