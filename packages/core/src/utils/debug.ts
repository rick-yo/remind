const isDev = import.meta.env.DEV

function debug(key: string, value?: unknown) {
  if (isDev) {
    console.log(key, value)
  }
}

export { debug }
