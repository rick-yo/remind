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

function inRange(
  num: number,
  start: number,
  end: number = Number.MAX_SAFE_INTEGER,
) {
  return num >= start && num < end
}

function minBy<T>(array: T[], iteratee: (item: T) => number): T {
  let min = array[0]
  array.forEach((item) => {
    if (iteratee(item) < iteratee(min)) {
      min = item
    }
  })
  return min
}

function maxBy<T>(array: T[], iteratee: (item: T) => number): T {
  let max = array[0]
  array.forEach((item) => {
    if (iteratee(item) > iteratee(max)) {
      max = item
    }
  })
  return max
}

export { noop, deepClone, classNames, toPX, average, inRange, minBy, maxBy }
