import { test, expect } from 'vitest'
import { renderHook, act } from '@testing-library/preact-hooks'
import { useModel } from '../src/model'
import { createTopic, TopicData } from '../src'

const mainTopic1 = createTopic('main topic 1')
const mainTopic2 = createTopic('main topic 2')
const root: TopicData = {
  ...createTopic('Central Topic'),
  children: [mainTopic1, mainTopic2],
}

const createModel = () => renderHook(() => useModel({ root }))

test('model get* method', async () => {
  const { result } = createModel()
  expect(result.current?.root).toBe(root)
  expect(result.current?.getNodeById(mainTopic1.id)).toEqual(mainTopic1)
  expect(result.current?.getParentNodeById(mainTopic1.id)).toEqual(root)

  await act(() => {
    const model = result.current
    model?.update(() => {
      model?.deleteNode(mainTopic2.id)
    })
  })

  expect(result.current?.getNodeById(mainTopic2.id)).toBeUndefined()
  expect(result.current?.getParentNodeById(mainTopic2.id)).toBeUndefined()
})

test('model update* method', async () => {
  const mainTopic3 = createTopic('main topic 3')
  const newTitle = 'updated'
  const { result } = createModel()

  await act(() => {
    const model = result.current
    model?.update(() => {
      model?.appendChild(model.root.id, mainTopic3)
    })
  })
  expect(result.current?.getNodeById(mainTopic3.id)).toEqual(mainTopic3)
  expect(result.current?.getParentNodeById(mainTopic3.id)).toEqual(
    result.current?.root,
  )

  await act(() => {
    const model = result.current
    model?.update(() => {
      model?.updateNode(mainTopic3.id, { title: newTitle })
    })
  })
  expect(result.current?.getNodeById(mainTopic3.id)?.title).toEqual(newTitle)

  await act(() => {
    const model = result.current
    model?.update(() => {
      model?.deleteNode(mainTopic3.id)
    })
  })
  expect(result.current?.getNodeById(mainTopic3.id)).toBeUndefined()
})

test('model undo redo', async () => {
  const { result } = createModel()

  await act(() => {
    const model = result.current
    model?.update(() => {
      model?.updateNode(model.root.id, { title: '1' })
    })
  })
  expect(result.current?.getNodeById(result.current.root.id)?.title).toEqual(
    '1',
  )

  await act(() => {
    result.current?.undo()
  })

  expect(result.current?.getNodeById(result.current.root.id)).toEqual(root)

  await act(() => {
    result.current?.redo()
  })
  expect(result.current?.getNodeById(result.current.root.id)?.title).toEqual(
    '1',
  )
})
