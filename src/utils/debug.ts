const isProd = process.env.NODE_ENV === 'production';

function debug(key: string, value?: any) {
  if (isProd) return;
  console.log(key, value);
}

export {
  isProd,
  debug,
}