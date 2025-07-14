import type { ProviderParameter } from './types'
import { getParameterValue } from './getParameterValue'

/** The options object for the {@linkcode setUrlPathParameter} function. */
export interface SetUrlPathParameterOptions {
  url: URL
  name: string
  parameter: ProviderParameter
  options: Record<string, unknown>
}

/**
 * Apply a path parameter to a URL based on the provider's parameter definition.
 *
 * @param options The options object containing the URL, parameter name, parameter definition, and values.
 * @param options.url The URL to which the path parameter will be applied.
 * @param options.name The name of the path parameter.
 * @param options.parameter The provider parameter definition containing the path and schema.
 * @param options.options The options object containing the values for the parameters.
 * @example
 * // Create a URL and apply a path parameter to it.
 * const url = new URL('https://api.example.com/users/:userId/posts');
 * const parameter = { name: 'userId', path: 'userId', location: 'path', schema: { type: 'string' } };
 *
 * // Set the path parameter 'userId' to '123'.
 * setUrlPathParameter({ url, name: 'userId', parameter, options: { userId: '123' } });
 * console.log(url.toString()); // Outputs: https://api.example.com/users/123/posts
 */
export function setUrlPathParameter({ url, name, parameter, options }: SetUrlPathParameterOptions): void {

  // --- Get the value from the parameters.
  const { path = name } = parameter
  const value = getParameterValue(name, parameter, options)
  if (!value) return

  // --- Ensure the value is a valid type for a path parameter.
  if (typeof value !== 'string'
    && typeof value !== 'number'
    && typeof value !== 'boolean')
    throw new Error(`Path parameter "${name}" must be a string, number, or boolean.`)

  // --- Apply the value to the URL path.
  url.pathname = url.pathname
    .replace(`/:${path}`, `/${encodeURIComponent(value)}`)
    .replace(`{${path}}`, encodeURIComponent(value))
}
