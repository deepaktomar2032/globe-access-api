/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from '@src/utils'

const injectable: (name: string, ...args: any[]) => ClassDecorator =
  (name: string, ...args: any[]): ClassDecorator =>
  (target: any): void => {
    Store.register(name, new target(...args))
  }

export { injectable as Injectable }
