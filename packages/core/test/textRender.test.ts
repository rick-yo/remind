import { test, expect } from 'vitest'
import { createText } from '../src/utils/textRender'

const defaultBox = {
  width: 150,
  height: 50,
}

const emptyText = ''
const shortText = 'How to use Remind 🤔'
const longText =
  'long text long text long text long text long text long text 中文中文中文中文中文中文中文中文'

// jsdom not support svg, skip textRender
test.skip('empty text', () => {
  const { lines, dimensions } = createText(emptyText, {
    style: {
      fontSize: '12px',
      lineHeight: '1.2',
    },
    box: defaultBox,
  })
  expect(lines.length).toBe(0)
  expect(dimensions.width).toBe(0)
  expect(dimensions.height).toBe(0)
})

test.skip('short text', () => {
  const { lines } = createText(shortText, {
    style: {
      fontSize: '14px',
      lineHeight: '1.2',
    },
    box: defaultBox,
  })
  expect(lines.length).toBe(1)
})

test.skip('long text', () => {
  const { lines } = createText(longText, {
    style: {
      fontSize: '20px',
      lineHeight: '1.2',
    },
    box: defaultBox,
  })

  expect(lines.length).toBe(4)
})
