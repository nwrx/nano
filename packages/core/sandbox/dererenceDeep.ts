/* eslint-disable n/no-sync */
import type { ObjectLike } from '@unshared/types'
import { tries } from '@unshared/functions'
import ivm from 'isolated-vm'

export type DereferencedDeep<T> =
  T extends ivm.Reference<infer U>
    ? U extends (...parameters: infer P) => infer R
      ? (...parameters: P) => Promise<DereferencedDeep<R>>
      : { [K in keyof U]: DereferencedDeep<U[K]> }
    : T

export function dererenceDeep<T>(value: T): DereferencedDeep<T>
export function dererenceDeep(value: unknown) {
  if (value instanceof ivm.Reference) {

    // --- When given a Reference<Function>, wrap the function
    // --- to allow calling it from the parent isolate context.
    // --- Additionally, dereference the result of the function.
    if (value.typeof === 'function') {
      return async(...parameters: any[]) => {
        const result = await value.apply(undefined, parameters, {
          result: {
            reference: true,
            promise: true,
          },
        })
        return dererenceDeep(result)
      }
    }

    // --- When the value is a reference to an object, try dereferencing,
    // --- copying, or proxying the object to allow reading its properties.
    if (value.typeof === 'object') {
      return tries(
        () => {
          const result = value.deref() as ObjectLike
          if (result === undefined) throw new Error('skip')
          return dererenceDeep(result)
        },
        () => {
          const result = value.copySync() as ObjectLike
          if (result === undefined) throw new Error('skip')
          return dererenceDeep(result)
        },
        () => new Proxy({}, {
          get(_, key: string) {
            const result = value.getSync(key) as unknown
            return dererenceDeep(result)
          },
        }),
      )
    }

    // --- Otherwise, return a copy of the value.
    return value.copySync() as unknown
  }

  // --- If value is a raw object, return a proxy object that allows reading
  // --- the properties of the object without having to dereference them manually.
  if (typeof value === 'object'
    && value !== null
    && (value.constructor === Object || value.constructor === Array)
  ) {
    return new Proxy(value, {
      get(_, key: string) {
        const result = (value as Record<string, unknown>)[key]
        return dererenceDeep(result)
      },
    })
  }

  // --- Return the value as-is if it is not a reference.
  return value
}
