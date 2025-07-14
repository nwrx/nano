import type { ProviderParameter } from './types'
import { getParameterValue } from './getParameterValue'
import { serializeRequestParameter } from './serializeRequestParameter'

/** The options object for the {@linkcode setUrlQueryParameter} function. */
export interface SetUrlQueryParameterOptions {
  url: URL
  name: string
  parameter: ProviderParameter
  options: Record<string, unknown>
}

/**
 * Apply a query parameter to a URL based on the provider's parameter definition.
 *
 * @param options The options object containing the URL, parameter name, parameter definition, and values.
 * @param options.url The URL to which the query parameter will be applied.
 * @param options.name The name of the query parameter.
 * @param options.parameter The provider parameter definition containing the path and schema.
 * @param options.options The options object containing the values for the parameters.
 * @example
 * // Create a URL and apply a query parameter to it.
 * const url = new URL('https://api.example.com/resource');
 * const parameter = { name: 'search', path: 'q', schema: { type: 'string' } };
 *
 * // Set the query parameter 'search' to 'test'.
 * setUrlQueryParameter({ url, name: 'search', parameter, options: { search: 'test' } });
 * console.log(url.toString()); // Outputs: https://api.example.com/resource?q=test
 */
export function setUrlQueryParameter({ url, name, parameter, options }: SetUrlQueryParameterOptions): void {

  // --- Get the value from the parameters.
  const { path = name } = parameter
  const value = getParameterValue(name, parameter, options)
  if (!value) return

  // --- Apply the value to the URL query.
  const valueSerialized = serializeRequestParameter(value)
  if (url.searchParams.has(path)) url.searchParams.set(path, valueSerialized)
  else url.searchParams.append(path, valueSerialized)
}
