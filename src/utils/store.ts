/* eslint-disable @typescript-eslint/no-explicit-any */

const container: Map<string, any> = new Map()
const requested: Map<string, { target: any; propertyKey: string | symbol; request: string }> = new Map()

const reserve: (target: any, propertyKey: string | symbol, request: string) => void = (
  target: any,
  propertyKey: string | symbol,
  request: string
): void => {
  requested.set(request.toUpperCase(), { propertyKey, request, target })
}

const register: (key: string, item: any) => void = (key: string, item: any): void => {
  if (requested.has(key.toUpperCase())) {
    requested.get(key.toUpperCase()).target[requested.get(key.toUpperCase()).propertyKey] = item
  }

  if (container.has(key.toUpperCase())) {
    const errMessage: string = `${key.toUpperCase()} already registered`
    console.error(errMessage)
    throw new Error(errMessage)
  }

  container.set(key.toUpperCase(), item)
}

const fetch: (key: string) => any = (key: string): any => container.get(key.toUpperCase())

const forEach: (cb: (value: any, key: string) => void) => void = (cb: (value: any, key: string) => void) =>
  container.forEach(cb)

const remove: (key: string) => boolean = (key: string): boolean => container.delete(key.toUpperCase())

export interface Storage {
  register: (key: string, item: any) => void

  fetch: (key: string) => any

  forEach: (cb: (value: any, key: string) => void) => void

  reserve: (target: any, propertyKey: string | symbol, request: string) => void

  remove: (key: string) => boolean
}

const store: Storage = { fetch, forEach, register, remove, reserve }

export { store as Store }
