/* eslint @typescript-eslint/no-empty-function: "off" */
const noop = () => {}

function deepClone<T>(obj: T) {
  return JSON.parse(JSON.stringify(obj)) as T
}

function classNames(...strs: string[]) {
  return strs.join(' ')
}

const toPX = (length: number | string) => `${length}px`

function average(nums: number[]) {
  return nums.reduce((p, c) => p + c, 0) / nums.length
}

export { noop, deepClone, classNames, toPX, average }
