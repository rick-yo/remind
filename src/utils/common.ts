/* eslint @typescript-eslint/no-empty-function: "off" */
const noop = () => {}

function deepClone<T>(obj: T) {
  return JSON.parse(JSON.stringify(obj)) as T
}

function classNames(...strs: string[]) {
  return strs.join(' ')
}

const toPX = (length: number | string) => `${length}px`

function sum(nums: number[]) {
  return nums.reduce((p, c) => p + c, 0)
}

export { noop, deepClone, classNames, toPX, sum }
