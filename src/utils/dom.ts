import { RefObject } from 'preact'
import { useEffect } from 'preact/hooks'
import { assert } from './assert'
import { debug } from './debug'

function selectText(element?: HTMLElement) {
  if (!element) return
  if (window.getSelection && document.createRange) {
    const selection = window.getSelection()
    if (selection?.toString() === '') {
      // No text selection
      setTimeout(function () {
        const range = document.createRange() // Range object
        range.selectNodeContents(element) // Sets Range
        selection.removeAllRanges() // Remove all ranges from selection
        selection.addRange(range) // Add Range to a Selection.
      }, 1)
    }
  }
}

function useClickOutSide(
  selector: string,
  callback: (e: MouseEvent) => void,
  deps: any[],
) {
  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      assert(e.target instanceof HTMLDivElement)
      const parent = e.target?.closest(selector)
      debug('onClickOutSide event fired')
      if (!parent) {
        callback(e)
      }
    }

    document.addEventListener('click', handleDocumentClick)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [selector, callback, ...deps])
}

function useIconFont() {
  const href = 'https://at.alicdn.com/t/font_1924427_4b37bvd5e4o.css'
  useEffect(() => {
    const linkElement = document.createElement('link')
    linkElement.setAttribute('rel', 'stylesheet')
    linkElement.setAttribute('href', href)
    document.querySelector('head')?.appendChild(linkElement)
    return () => {
      linkElement.remove()
    }
  }, [])
}

function usePassiveWheelEvent(
  ref: RefObject<HTMLElement> | undefined,
  callback: (e: WheelEvent) => void,
) {
  useEffect(() => {
    ref?.current?.addEventListener('wheel', callback, {
      passive: false,
    })
    return () => {
      ref?.current?.removeEventListener('wheel', callback)
    }
  }, [ref, callback])
}

export { selectText, useClickOutSide, useIconFont, usePassiveWheelEvent }
