import { RefObject } from 'preact'
import { useEffect } from 'preact/hooks'

type Options<T extends RefObject<HTMLElement>> = {
  target?: T
  capture?: boolean
  once?: boolean
  passive?: boolean
}

function useEventListener<
  K extends keyof HTMLElementEventMap,
  E extends RefObject<HTMLElement>,
>(
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options: Options<E> = {},
): void {
  const targetElement = options.target?.current
  const { target, ...eventOptions } = options

  useEffect(() => {
    if (!targetElement) return
    targetElement.addEventListener(eventName, handler, eventOptions)

    return () => {
      targetElement.removeEventListener(eventName, handler, eventOptions)
    }
  }, [targetElement, handler, eventOptions])
}

export { useEventListener }
