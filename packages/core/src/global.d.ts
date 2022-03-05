declare global {
  interface Crypto {
    randomUUID: () => string
  }
}
