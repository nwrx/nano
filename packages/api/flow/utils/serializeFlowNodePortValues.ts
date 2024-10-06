import type { FlowNodePortValue } from '@nwrx/core'

/**
 * Serializes the values of a flow node port.
 *
 * @param values The values to serialize.
 * @returns The serialized values of the flow node port.
 */
export function serializeFlowNodePortValues(values: unknown): FlowNodePortValue[] {

  // --- Map the values to an array of serialized values.
  if (Array.isArray(values))
    return values.map((value: FlowNodePortValue | string) => (typeof value === 'string' ? { value, label: value } : value))

  // --- Cast values to an array if it's an object.
  if (typeof values === 'object' && values !== null)
    return Object.entries(values).map(([value, label]) => ({ value, label: String(label) }) as FlowNodePortValue)

  // --- Return an empty array if the values are not defined
  return []
}
