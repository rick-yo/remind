import { assert } from './assert'
import { isObject } from './is'

interface Padding {
  top: number
  left: number
  right: number
  bottom: number
}

interface TextBBox {
  width: number
  height: number
}

interface LayoutLine {
  width: number
  height: number
  text: string
}

interface Option {
  /**
   * bounding box that text rendered
   */
  box: TextBBox
  /**
   * style to be applied to the text
   */
  style: Pick<CSSStyleDeclaration, 'lineHeight' | 'fontSize' | 'fontFamily'>
  /**
   * how to align in the bounding box. Any of { 'center-middle', 'center-top' }, defaults to 'center-top'.
   */
  align?: string
  /**
   * indicates if box will be recalculated to fit text
   */
  fitBox?: boolean
  padding?: number
}

const hasOwnProperty = Object.prototype.hasOwnProperty

function svgCreate<K extends keyof SVGElementTagNameMap>(
  tag: K,
): SVGElementTagNameMap[K] {
  return document.createElementNS('http://www.w3.org/2000/svg', tag)
}

function svgAttr(el: SVGElement, attrs: Record<string, any>) {
  for (const p in attrs) {
    if (hasOwnProperty.call(attrs, p)) {
      el.setAttributeNS(
        null,
        p.replace(/[A-Z]/g, function (m) {
          return '-' + m.toLowerCase()
        }),
        attrs[p],
      )
    }
  }
}

const DEFAULT_BOX_PADDING = 0

function parseAlign(align: string) {
  const parts = align.split('-')

  return {
    horizontal: parts[0] || 'center',
    vertical: parts[1] || 'top',
  }
}

function parsePadding(padding: Padding | number) {
  if (isObject(padding)) {
    // @ts-expect-error suppress ts error
    return { top: 0, left: 0, right: 0, bottom: 0, ...padding }
  }

  return {
    top: padding,
    left: padding,
    right: padding,
    bottom: padding,
  }
}

function getTextBBox(text: string, fakeText: SVGTextElement) {
  fakeText.textContent = text

  let textBBox

  try {
    const emptyLine = text === ''

    // add dummy text, when line is empty to
    // determine correct height
    fakeText.textContent = emptyLine ? 'dummy' : text

    textBBox = fakeText.getBBox()

    // take text rendering related horizontal
    // padding into account
    const bbox: TextBBox = {
      width: textBBox.width + textBBox.x * 2,
      height: textBBox.height,
    }

    if (emptyLine) {
      // correct width
      bbox.width = 0
    }

    return bbox
  } catch {
    return { width: 0, height: 0 }
  }
}

/**
 * Layout the next line and return the layouted element.
 *
 * Alters the lines passed.
 *
 * @param  {Array<string>} lines
 * @return {Object} the line descriptor, an object { width, height, text }
 */
function layoutNext(
  lines: string[],
  maxWidth: number,
  fakeText: SVGTextElement,
): LayoutLine {
  const originalLine = lines.shift()
  assert(originalLine)
  let fitLine = originalLine

  let textBBox

  for (;;) {
    textBBox = getTextBBox(fitLine, fakeText)

    textBBox.width = fitLine ? textBBox.width : 0

    // try to fit
    if (
      fitLine === ' ' ||
      fitLine === '' ||
      textBBox.width < Math.round(maxWidth) ||
      fitLine.length < 2
    ) {
      return fit(lines, fitLine, originalLine, textBBox)
    }

    fitLine = shortenLine(fitLine, textBBox.width, maxWidth)
  }
}

function fit(
  lines: string[],
  fitLine: string,
  originalLine: string,
  textBBox: TextBBox,
) {
  if (fitLine.length < originalLine.length) {
    const remainder = originalLine.slice(fitLine.length).trim()

    lines.unshift(remainder)
  }

  return {
    width: textBBox.width,
    height: textBBox.height,
    text: fitLine,
  }
}

const SOFT_BREAK = '\u00AD'

/**
 * Shortens a line based on spacing and hyphens.
 * Returns the shortened result on success.
 *
 * @param  {string} line
 * @param  {number} maxLength the maximum characters of the string
 * @return {string} the shortened string
 */
function semanticShorten(line: string, maxLength: number) {
  const parts = line.split(/([-\s\u00AD])/g)
  let part
  const shortenedParts = []
  let length = 0

  // try to shorten via break chars
  if (parts.length > 1) {
    while ((part = parts.shift())) {
      if (part.length + length < maxLength) {
        shortenedParts.push(part)
        length += part.length
      } else {
        // remove previous part, too if hyphen does not fit anymore
        if (part === '-' || part === SOFT_BREAK) {
          shortenedParts.pop()
        }

        break
      }
    }
  }

  const last = shortenedParts[shortenedParts.length - 1]

  // translate trailing soft break to actual hyphen
  if (last && last === SOFT_BREAK) {
    shortenedParts[shortenedParts.length - 1] = '-'
  }

  return shortenedParts.join('')
}

function shortenLine(line: string, width: number, maxWidth: number) {
  const length = Math.max(line.length * (maxWidth / width), 1)

  // try to shorten semantically (i.e. based on spaces and hyphens)
  let shortenedLine = semanticShorten(line, length)

  if (!shortenedLine) {
    // force shorten by cutting the long word
    shortenedLine = line.slice(0, Math.max(Math.round(length - 1), 1))
  }

  return shortenedLine
}

function getHelperSvg() {
  let helperSvg = document.querySelector('#helper-svg')

  if (!helperSvg) {
    helperSvg = svgCreate('svg')

    svgAttr(helperSvg as SVGSVGElement, {
      id: 'helper-svg',
      width: 0,
      height: 0,
      style: 'visibility: hidden; position: fixed',
    })

    document.body.append(helperSvg)
  }

  return helperSvg
}

const defaultConfig = {
  padding: DEFAULT_BOX_PADDING,
  style: {},
  align: 'center-top',
}

/**
 * Creates and returns a label and its bounding box.
 *
 * @param text the text to render on the label
 * @param options
 *
 */
function createText(text: string, options: Option) {
  const { box } = options
  const style = { ...defaultConfig.style, ...options.style }
  const align = parseAlign(options.align ?? defaultConfig.align)
  const padding = parsePadding(options.padding ?? defaultConfig.padding)
  const fitBox = options.fitBox ?? false

  const lineHeight = getLineHeight(style)

  // we split text by lines and normalize
  // {soft break} + {line break} => { line break }
  const lines = text.split(/\u00AD?\r?\n/)
  const layouted: LayoutLine[] = []

  const maxWidth = box.width - padding.left - padding.right

  // ensure correct rendering by attaching helper text node to invisible SVG
  const helperText = svgCreate('text')
  svgAttr(helperText, { x: 0, y: 0 })
  svgAttr(helperText, style)

  const helperSvg = getHelperSvg()
  helperSvg.append(helperText)

  while (lines.length > 0) {
    layouted.push(layoutNext(lines, maxWidth, helperText))
  }

  if (align.vertical === 'middle') {
    padding.top = padding.bottom = 0
  }

  const totalHeight =
    layouted.reduce(function (sum, line) {
      return sum + (lineHeight ?? line.height)
    }, 0) +
    padding.top +
    padding.bottom

  const maxLineWidth = layouted.reduce(function (sum, line) {
    return line.width > sum ? line.width : sum
  }, 0)

  // the y position of the next line
  let y = padding.top

  if (align.vertical === 'middle') {
    y += (box.height - totalHeight) / 2
  }

  // magic number initial offset
  y -= (lineHeight ?? layouted[0].height) / 4

  const layoutLines: Array<
    LayoutLine & {
      x: number
      y: number
    }
  > = []
  // layout each line taking into account that parent
  // shape might resize to fit text size
  layouted.forEach(function (line) {
    let x

    y += lineHeight ?? line.height

    switch (align.horizontal) {
      case 'left':
        x = padding.left
        break

      case 'right':
        x = (fitBox ? maxLineWidth : maxWidth) - padding.right - line.width
        break

      default:
        // aka center
        x = Math.max(
          ((fitBox ? maxLineWidth : maxWidth) - line.width) / 2 + padding.left,
          0,
        )
    }

    layoutLines.push({
      ...line,
      x,
      y,
    })
  })

  helperText.remove()

  const dimensions = {
    width: maxLineWidth,
    height: totalHeight,
  }

  return {
    dimensions,
    lines: layoutLines,
  }
}

function getLineHeight(style: Option['style']) {
  return (
    Number.parseFloat(style.lineHeight) * Number.parseInt(style.fontSize, 10)
  )
}

export { createText }
