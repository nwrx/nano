import type { ProviderParameter } from './defineProviderOptions'
import { getParameterValue } from './getParameterValue'
import { serializeRequestParameter } from './serializeRequestParameter'

export function setUrlQueryParameter(
  url: URL,
  mapping: ProviderParameter,
  parameters: Record<string, unknown>,
): URL {

  // --- Get the value from the parameters.
  const { path } = mapping
  const value = getParameterValue(mapping, parameters)
  if (!value) return url

  // --- Apply the value to the URL query.
  const valueSerialized = serializeRequestParameter(value)
  if (url.searchParams.has(path)) url.searchParams.set(path, valueSerialized)
  else url.searchParams.append(path, valueSerialized)
  return url
}
