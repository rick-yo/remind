const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

function debug(key: string, value?: unknown) {
  if (isDev) {
    console.log(key, value);
  }
}

export { isProd, debug };
