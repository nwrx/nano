import type { ProviderParameter } from './defineProviderOptions'
import { getParameterValue } from './getParameterValue'

export function setRequestBody(
  init: RequestInit,
  parameter: ProviderParameter,
  options: Record<string, unknown>,
): RequestInit {

  // --- Get the value from the parameters.
  const { path } = parameter
  const value = getParameterValue(parameter, options)
  if (!value) return init

  // --- Get the current body or initialize it if not present.
  let bodyObject = {}
  if (init.body) {
    if (typeof init.body === 'string') {
      try { bodyObject = JSON.parse(init.body) as Record<string, unknown> }
      catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(`Failed to parse existing body as JSON: ${message}`)
      }
    }
    else {
      throw new TypeError(`Unsupported body type: ${typeof init.body}`)
    }
  }

  // --- Apply the value at maybe-nested path in the body object.
  const pathParts = path.split('.')
  let current = bodyObject
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i]

    // --- Prevent prototype pollution.
    if (part === '__proto__' || part === 'constructor' || part === 'prototype')
      throw new Error(`Invalid path part: "${part}"`)

    if (!(part in current)) current[part] = {}
    current = current[part]
  }
  current[pathParts.at(-1)] = value

  // --- Set the modified body back to the request.
  init.body = JSON.stringify(bodyObject)
  return init
}
