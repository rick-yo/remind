function isObject(obj: unknown): obj is object {
  return obj !== null && typeof obj === 'object'
}

function isString(obj: unknown): obj is string {
  return typeof obj === 'string'
}

const isSVGElement = (el: unknown): el is SVGElement => el instanceof SVGElement

const isHTMLElement = (el: unknown): el is HTMLElement =>
  el instanceof HTMLElement

export { isObject, isHTMLElement, isSVGElement, isString }
