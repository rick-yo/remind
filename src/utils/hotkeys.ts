import hotkeys, { KeyHandler } from 'hotkeys-js'
import { useCallback, useEffect } from 'preact/hooks'

function useHotKeys(keys: string, callback: KeyHandler, deps: any[]) {
  const memoisedCallback = useCallback(callback, deps)
  useEffect(() => {
    hotkeys(keys, memoisedCallback)
    return () => {
      hotkeys.unbind(keys, memoisedCallback)
    }
  }, [keys, memoisedCallback])
}

export { useHotKeys }
