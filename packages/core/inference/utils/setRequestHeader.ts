import type { ProviderParameter } from './defineProviderOptions'
import { getParameterValue } from './getParameterValue'
import { serializeRequestParameter } from './serializeRequestParameter'

export function setRequestHeader(
  init: RequestInit,
  mapping: ProviderParameter,
  parameters: Record<string, unknown>,
): RequestInit {

  // --- Get and serialize the value for the header.
  const { path } = mapping
  const { headers = new Headers() } = init
  const value = getParameterValue(mapping, parameters)
  if (!value) return init

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

  // --- Return the modified request object.
  init.headers = headers
  return init
}
