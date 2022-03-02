// Fork https://github.com/jamiebuilds/unstated-next
// to avoid complex build/test tool configure and wierd error on hooks/context
import { ComponentType, createContext, JSX } from 'preact'
import { useContext } from 'preact/hooks'

const EMPTY: unique symbol = Symbol('EMPTY')

export interface ContainerProviderProps<State = void> {
  initialState?: State
  children: JSX.Element
}

export interface Container<Value, State = void> {
  Provider: ComponentType<ContainerProviderProps<State>>
  useContainer: () => Value
}

export function createContainer<Value, State = void>(
  useHook: (initialState?: State) => Value,
): Container<Value, State> {
  const Context = createContext<Value | typeof EMPTY>(EMPTY)

  function Provider(props: ContainerProviderProps<State>) {
    const value = useHook(props.initialState)
    return <Context.Provider value={value}>{props.children}</Context.Provider>
  }

  function useContainer(): Value {
    const value = useContext(Context)
    if (value === EMPTY) {
      throw new Error('Component must be wrapped with <Container.Provider>')
    }

    return value
  }

  return { Provider, useContainer }
}

export function useContainer<Value, State = void>(
  container: Container<Value, State>,
): Value {
  return container.useContainer()
}
