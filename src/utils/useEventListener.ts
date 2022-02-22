import { MutableRef, useEffect } from 'preact/hooks'

type Options<T extends MutableRef<HTMLElement>> = {
  target?: T
  capture?: boolean
  once?: boolean
  passive?: boolean
}

function useEventListener<
  K extends keyof HTMLElementEventMap,
  E extends MutableRef<HTMLElement>,
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
  }, [targetElement])
}

export { useEventListener }
