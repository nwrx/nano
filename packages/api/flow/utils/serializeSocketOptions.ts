import type { SocketListOption } from '@nwrx/core'

/**
 * Serializes the values of a flow node port.
 *
 * @param options The values to serialize.
 * @returns The serialized values of the flow node port.
 */
export function serializeSocketOptions(options?: Array<SocketListOption | string>): SocketListOption[] {
  if (!options) return []

  // --- Map the values to an array of serialized values.
  if (Array.isArray(options))
    return options.map(value => (typeof value === 'string' ? { value, label: value } : value))

  // --- Cast values to an array if it's an object.
  if (typeof options === 'object' && options !== null)
    return Object.entries(options).map(([value, label]) => ({ value, label: String(label) }))

  // --- Return an empty array if the values are not defined
  return []
}
