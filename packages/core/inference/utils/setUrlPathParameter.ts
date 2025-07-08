import type { ProviderParameter } from './defineProviderOptions'
import { getParameterValue } from './getParameterValue'

export function setUrlPathParameter(
  url: URL,
  parameter: ProviderParameter,
  options: Record<string, unknown>,
): URL {

  // --- Get the value from the parameters.
  const { name, path } = parameter
  const value = getParameterValue(parameter, options)
  if (!value) return url

  // --- Ensure the value is a valid type for a path parameter.
  if (typeof value !== 'string'
    && typeof value !== 'number'
    && typeof value !== 'boolean')
    throw new Error(`Path parameter "${name}" must be a string, number, or boolean.`)

  // --- Apply the value to the URL path.
  url.pathname = url.pathname
    .replace(`/:${path}`, `/${encodeURIComponent(value)}`)
    .replace(`/{${path}}`, `/${encodeURIComponent(value)}`)

  // --- Return the modified URL.
  return url
}
