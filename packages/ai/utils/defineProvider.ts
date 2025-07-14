import type { WriteableDeep } from '@unshared/types'
import type { Provider } from './types'

/**
 * Define a provider options object. This function is used to create a
 * strongly-typed provider options object that can be used to configure
 * the path, base URL, and other options for a provider.
 *
 * @param provider The {@linkcode Provider} object that defines the provider's options.
 * @returns A read-only version of the provider options object.
 */
export function defineProvider<T extends Provider>(provider: WriteableDeep<T>): T {
  return provider as T
}
