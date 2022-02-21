/* eslint @typescript-eslint/no-empty-function: "off" */
const noop = () => {}

function deepClone<T>(obj: T) {
  return JSON.parse(JSON.stringify(obj)) as T
}

function classNames(...strs: string[]) {
  return strs.join(' ')
}

const toPX = (length: number | string) => `${length}px`

export { noop, deepClone, classNames, toPX }
