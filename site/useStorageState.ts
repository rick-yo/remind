import { useState, useRef, useEffect } from 'react';

export interface IFuncUpdater<T> {
  (previousState?: T): T;
}

export type StorageStateDefaultValue<T> = T | IFuncUpdater<T>;

export type StorageStateResult<T> = [
  T | undefined,
  (value: StorageStateDefaultValue<T>) => void
];

function isFunction<T>(obj: any): obj is T {
  return typeof obj === 'function';
}

function useStorageState<T>(
  storage: Storage,
  key: string,
  defaultValue?: StorageStateDefaultValue<T>
): StorageStateResult<T> {
  const [state, setState] = useState<T | undefined>(() => getStoredValue());

  function getStoredValue() {
    const raw = storage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    if (isFunction<IFuncUpdater<T>>(defaultValue)) {
      return defaultValue();
    }
    return defaultValue;
  }

  function updateState(value?: T | IFuncUpdater<T>) {
    if (typeof value === 'undefined') {
      storage.removeItem(key);
      setState(undefined);
    } else if (isFunction<IFuncUpdater<T>>(value)) {
      const previousState = getStoredValue();
      const currentState = value(previousState);
      storage.setItem(key, JSON.stringify(currentState));
      setState(currentState);
    } else {
      storage.setItem(key, JSON.stringify(value));
      setState(value);
    }
  }

  useUpdateEffect(() => {
    setState(getStoredValue());
  }, [key]);

  return [state, updateState];
}

const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};

export default useStorageState;
