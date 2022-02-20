const isProd = import.meta.env.PROD
const isDev = !isProd

function debug(key: string, value?: unknown) {
  if (isDev) {
    console.log(key, value)
  }
}

export { isProd, debug }
