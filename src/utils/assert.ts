function assert(
  value: unknown,
  message: string | Error = 'Unexpected error',
): asserts value {
  if (!value) {
    throw message instanceof Error ? message : new Error(message)
  }
}

export { assert }
