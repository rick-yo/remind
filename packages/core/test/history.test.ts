import { test, expect, fn } from 'vitest'
import { History } from '../src/utils/history'

interface IState {
  id: number
  name: string
  children: IState[]
}

const getState = (): IState => ({
  id: 0,
  name: 'root',
  children: [{ id: 1, name: 'a', children: [] }],
})

test('can init history', () => {
  const history = new History()
  const state = getState()
  history.pushSync(state)
  expect(history.get()).toEqual(state)
})

test('has correct undo/redo flag', () => {
  const history = new History()
  expect(history.canUndo).toBeFalsy()
  expect(history.canRedo).toBeFalsy()

  history.pushSync(1)
  expect(history.canUndo).toBeFalsy()
  expect(history.canRedo).toBeFalsy()

  history.pushSync(2)
  expect(history.canUndo).toBeTruthy()
  expect(history.canRedo).toBeFalsy()

  history.undo()
  expect(history.canUndo).toBeFalsy()
  expect(history.canRedo).toBeTruthy()

  history.redo()
  expect(history.canUndo).toBeTruthy()
  expect(history.canRedo).toBeFalsy()
})

test('can get state after undo', () => {
  const history = new History<{ count: number }>()
  history.pushSync({ count: 1 })
  history.pushSync({ count: 2 })
  history.pushSync({ count: 3 })

  expect(history.get().count).toEqual(3)
  expect(history.undo().get().count).toEqual(2)
  expect(history.undo().get().count).toEqual(1)
})

test('can get state with redundant api call', () => {
  const history = new History<{ count: number }>()
  history.pushSync({ count: 1 })
  history.pushSync({ count: 2 })
  history.pushSync({ count: 3 })

  history.undo().undo().undo().undo().undo()
  expect(history.get().count).toEqual(1)
  expect(history.canUndo).toBeFalsy()

  history.redo().redo().redo().redo().redo()
  expect(history.get().count).toEqual(3)
  expect(history.canRedo).toBeFalsy()
})

test('can clear redo records', () => {
  const history = new History<{ count: number }>()

  for (let i = 0; i < 10; i++) {
    history.pushSync({ count: i })
  }

  for (let i = 0; i < 5; i++) {
    history.undo()
  }

  history.pushSync({ count: -1 })

  for (let i = history.current + 1; i < 10; i++) {
    expect(history.records[i]).toBeUndefined()
  }

  expect(history.canUndo).toBeTruthy()
  expect(history.canRedo).toBeFalsy()
})

test('support change callback', () => {
  const onChange = fn(() => {
    //
  })
  const history = new History()
  history.addEventListener(History.EventTypes.change, onChange)
  const state = getState()
  history.pushSync(state)
  expect(onChange.mock.calls.length).toBe(1)
})

test("change callback isn't fired for History initialize", () => {
  const onChange = fn(() => {
    //
  })
  const history = new History()
  history.addEventListener(History.EventTypes.change, onChange)
  expect(onChange.mock.calls.length).toBe(0)
})
