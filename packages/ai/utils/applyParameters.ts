import type { ProviderParameters } from './types'
import { setRequestBody } from './setRequestBody'
import { setRequestHeader } from './setRequestHeader'
import { setUrlPathParameter } from './setUrlPathParameter'
import { setUrlQueryParameter } from './setUrlQueryParameter'

/** The options object for the {@linkcode applyParameters} function. */
export interface ApplyParametersOptions {
  url: URL
  init: RequestInit
  parameters?: ProviderParameters
  options?: Record<string, unknown>
}

/**
 * Given a URL, RequestInit object, and an array of parameters, map
 * the parameters to the appropriate location in the request based
 * on the provider's parameter definitions and the specified options.
 *
 * @param _options The options object containing the URL, RequestInit, parameters, and additional options.
 * @example
 *
 * // Create a URL and RequestInit object
 * const url = new URL('https://api.example.com/resource/:userId');
 * const init: RequestInit = { method: 'POST' };
 *
 * // Define parameters to be applied
 * const parameters = {
 *   apiKey: {
 *     location: 'header',
 *     path: 'Authorization',
 *     schema: { type: 'string' }
 *   },
 *   userId: {
 *     location: 'path',
 *     path: 'userId',
 *     schema: { type: 'string' }
 *   }
 * };
 *
 * // Apply parameters to the request
 * applyParameters({
 *   url,
 *   init,
 *   parameters,
 *   options: { apiKey: '...', userId: '123' }
 * });
 *
 * // The URL and init object will now have the parameters applied
 * console.log(url.toString()); // https://api.example.com/resource/userId/123
 * console.log(init.headers); // { Authorization: 'Bearer ...' }
 */
export function applyParameters(_options: ApplyParametersOptions): void {
  const { url, init, parameters = {}, options = {} } = _options

  for (const [name, parameter] of Object.entries(parameters)) {
    if (parameter.location === 'header')
      setRequestHeader({ init, name, parameter, options })
    else if (parameter.location === 'body')
      setRequestBody({ init, name, parameter, options })
    else if (parameter.location === 'path')
      setUrlPathParameter({ url, name, parameter, options })
    else if (parameter.location === 'query')
      setUrlQueryParameter({ url, name, parameter, options })
    else throw new Error(`Unsupported mapping location: ${parameter.location as string}`)
  }
}
