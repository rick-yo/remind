import hotkeys from 'hotkeys-js';
import { useEffect, useCallback } from 'react';

function useHotKeys(keys: string, callback: () => any, deps: any[] = []) {
  const memoisedCallback = useCallback(callback, deps);
  useEffect(() => {
    hotkeys(keys, memoisedCallback);
    return () => {
      hotkeys.unbind(keys, memoisedCallback);
    };
  }, []);
}

export { useHotKeys };
