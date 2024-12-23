export const transformException = (error: unknown): object => {
  const err: Error = error as Error

  return {
    exception: err.name,
    exceptionMessage: err.message,
    stacktrace: err.stack
  }
}
