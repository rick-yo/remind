import hotkeys, { KeyHandler } from 'hotkeys-js'
import { useEffect, useCallback, DependencyList } from 'react'

function useHotKeys (keys: string, callback: KeyHandler, deps: DependencyList) {
  const memoisedCallback = useCallback(callback, deps)
  useEffect(() => {
    hotkeys(keys, memoisedCallback)
    return () => {
      hotkeys.unbind(keys, memoisedCallback)
    }
  }, [keys, memoisedCallback])
}

export { useHotKeys }
