/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Function } from '@unshared/types'
import type { EffectScope } from 'vue'
import { effectScope } from 'vue'

export interface CachedComposableInstance<T extends Function = Function> {
  scope: EffectScope
  subscribers: number
  state: ReturnType<T>
}

export interface CreateCachedComposableOptions<T extends Function = Function> {
  cacheKey?: (...args: Parameters<T>) => string
  cacheMap?: Map<string, CachedComposableInstance<T>>
}

/**
 * Creates a cached version of a composable function that can be reused across multiple calls.
 * Each unique set of arguments will create a new instance that can be shared.
 * The cached instance will be disposed of when there are no subscribers left.
 *
 * @param composable The composable function to cache.
 * @param options Options to customize the caching behavior.
 * @returns A cached version of the composable function.
 */
export function createCachedComposable<T extends Function>(composable: T, options: CreateCachedComposableOptions<T> = {}): T {
  const {
    cacheKey = (...args: unknown[]) => args.join('/'),
    cacheMap: instances = new Map<string, CachedComposableInstance<T>>(),
  } = options

  // --- Handle disposal of cached instances.
  function dispose(key: string) {
    const instance = instances.get(key)
    if (!instance) return
    instance.subscribers -= 1
    if (instance.subscribers > 0) return
    instance.scope.stop()
    instances.delete(key)
  }

  // --- Create a cached version of the composable function.
  const cachedComposable = (...args: unknown[]): unknown => {
    const key = cacheKey(...args as Parameters<T>)
    let instance = instances.get(key)

    // --- If an instance already exists, increment the subscriber
    // --- count and return the existing state of the composable.
    if (!instance) {
      const scope = effectScope(true)
      const state = scope.run(() => composable(...args))
      instance = { scope, subscribers: 0, state } as CachedComposableInstance<T>
      instances.set(key, instance)
    }

    // --- Increment the subscriber count and set up disposal.
    instance.subscribers += 1
    tryOnScopeDispose(() => dispose(key))
    return instance.state
  }

  // --- Return the cached composable function.
  return cachedComposable as T
}
