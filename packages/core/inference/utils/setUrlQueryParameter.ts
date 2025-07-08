import type { ProviderParameter } from './defineProviderOptions'
import { getParameterValue } from './getParameterValue'
import { serializeRequestParameter } from './serializeRequestParameter'

export function setUrlQueryParameter(
  url: URL,
  parameter: ProviderParameter,
  options: Record<string, unknown>,
): URL {

  // --- Get the value from the parameters.
  const { path } = parameter
  const value = getParameterValue(parameter, options)
  if (!value) return url

  // --- Apply the value to the URL query.
  const valueSerialized = serializeRequestParameter(value)
  if (url.searchParams.has(path)) url.searchParams.set(path, valueSerialized)
  else url.searchParams.append(path, valueSerialized)
  return url
}
