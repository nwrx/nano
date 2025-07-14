import type { ProviderParameter } from './types'
import { getParameterValue } from './getParameterValue'
import { serializeRequestParameter } from './serializeRequestParameter'

/** The options object for the {@linkcode setRequestHeader} function. */
export interface SetRequestHeaderOptions {
  init: RequestInit
  name: string
  parameter: ProviderParameter
  options: Record<string, unknown>
}

/**
 * Apply a header parameter to a RequestInit object based on the provider's parameter definition.
 *
 * @param options The options object containing the RequestInit, parameter name, parameter definition, and values.
 * @param options.init The RequestInit object to which the header will be applied.
 * @param options.name The name of the header parameter.
 * @param options.parameter The provider parameter definition containing the path and schema.
 * @param options.options The options object containing the values for the parameters.
 * @example
 * // Create a RequestInit object and apply a header parameter to it.
 * const init: RequestInit = { method: 'POST' };
 * const parameter = { name: 'apiKey', path: 'Authorization', location: 'header', schema: { type: 'string' } };
 *
 * // Set the header 'Authorization' with the API key.
 * setRequestHeader({ init, name: 'apiKey', parameter, options: { apiKey: '...' } });
 * console.log(init.headers) // { Authorization: 'Bearer ...' }
 */
export function setRequestHeader({ init, name, parameter, options }: SetRequestHeaderOptions): void {

  // --- Get and serialize the value for the header.
  const { path = name } = parameter
  const { headers = new Headers() } = init
  const value = getParameterValue(name, parameter, options)
  if (!value) return

  // --- Ensure the value is a string. Additionally, if the path is `Authorization`,
  // --- we should ensure that the value is prefixed with `Bearer ` if not already.
  let valueSerialized = serializeRequestParameter(value)
  if (path.toLowerCase() === 'authorization' && !valueSerialized.startsWith('Bearer '))
    valueSerialized = `Bearer ${valueSerialized}`

  // --- Apply the header to the Headers object or array.
  if (headers instanceof Headers)
    headers.set(path, valueSerialized)
  else if (Array.isArray(headers))
    headers.push([path, valueSerialized])
  else if (typeof headers === 'object')
    headers[path] = valueSerialized
  else if (headers)
    throw new Error(`Unsupported headers type: ${typeof headers}`)

  // --- Set the modified headers back to the request.
  init.headers = headers
}
