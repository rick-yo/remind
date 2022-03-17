import { RefObject } from 'preact'
import { assert } from './assert'

const head = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`
const notFound = 'svg element not found'

function getSVGOuterHTML(view: RefObject<HTMLDivElement>) {
  const svgElement = view.current?.querySelector('svg')
  assert(svgElement, notFound)
  const outerHTML = svgElement.outerHTML.replace(/&nbsp;/g, ' ')
  return {
    svgElement,
    outerHTML,
  }
}

/**
 * generate svg content
 * @param view
 * @returns
 * @example
 * const { content } = toSVG(instance.current.view)
 * download(content, 'remind.svg')
 */
function toSVG(view: RefObject<HTMLDivElement>): { content: string } & DOMRect {
  const { svgElement, outerHTML } = getSVGOuterHTML(view)
  const svg = URL.createObjectURL(new Blob([head + outerHTML]))

  return {
    content: svg,
    ...svgElement.getBBox(),
  }
}

/**
 * generate PNG content
 * @param view
 * @returns
 * @example
 * const content = await toPNG(instance.current.view)
 * download(content, 'remind.png')
 */
async function toPNG(view: RefObject<HTMLDivElement>): Promise<string> {
  return new Promise((resolve) => {
    const { svgElement, outerHTML } = getSVGOuterHTML(view)
    const { width, height } = svgElement.getBBox()
    const img = new Image()
    img.src = URL.createObjectURL(
      new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' }),
    )

    img.addEventListener('load', () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, width, height)
      const imgURL = canvas.toDataURL()
      resolve(imgURL)
      canvas.remove()
    })
  })
}

function download(href: string, download: string) {
  const a = document.createElement('a')
  a.href = href
  a.download = download
  a.click()
}

export { toSVG, toPNG, download }
