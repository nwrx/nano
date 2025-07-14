import type { ProviderParameter } from './types'
import { getParameterValue } from './getParameterValue'

/** The options object for the {@linkcode setRequestBody} function. */
export interface SetRequestBodyOptions {
  init: RequestInit
  name: string
  parameter: ProviderParameter
  options: Record<string, unknown>
}

/**
 * Apply a body parameter to a RequestInit object based on the provider's parameter definition.
 *
 * @param options The options object containing the RequestInit, parameter name, parameter definition, and values.
 * @param options.init The RequestInit object to which the body parameter will be applied.
 * @param options.name The name of the body parameter.
 * @param options.parameter The provider parameter definition containing the path and schema.
 * @param options.options The options object containing the values for the parameters.
 * @example
 * // Create a RequestInit object and apply a body parameter to it.
 * const init: RequestInit = { method: 'POST' };
 * const parameter = { name: 'message', path: 'messages.0.content', location: 'body', schema: { type: 'string' } };
 *
 * // Set the body parameter 'message' in the nested path.
 * setRequestBody({ init, name: 'message', parameter, options: { message: 'Hello World' } });
 */
export function setRequestBody({ init, name, parameter, options }: SetRequestBodyOptions): void {

  // --- Get the value from the parameters.
  const { path = name } = parameter
  const value = getParameterValue(name, parameter, options)
  if (!value) return

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
  const lastPart = pathParts.at(-1)
  let current = bodyObject as Record<string, unknown>
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i]

    // --- Prevent prototype pollution.
    if (part === '__proto__' || part === 'constructor' || part === 'prototype')
      throw new Error(`Invalid path part: "${part}"`)

    if (part in current === false) current[part] = {}
    current = current[part] as Record<string, unknown>
  }
  current[lastPart!] = value

  // --- Set the modified body back to the request.
  init.body = JSON.stringify(bodyObject)
}
