import type { FlowNodePortDisplay, FlowNodePortValue, FlowSchema } from '@nwrx/core'
import type { MaybeFunction, MaybePromise } from '@unshared/types'
import { serializeFlowNodePortValues } from './serializeFlowNodePortValues'

/** The serialized representation of a flow node port. */
export interface FlowNodePortJSON {
  key: string
  name: string
  typeKind: string
  typeName?: string
  typeColor?: string
  typeDescription?: string
  display?: FlowNodePortDisplay
  description?: string
  defaultValue?: unknown
  disallowStatic?: boolean
  disallowDynamic?: boolean
  values?: FlowNodePortValue[]
  numberMax?: number
  numberMin?: number
  numberStep?: number
}

/**
 * Given a `FlowSchema` object, returns a serialized version of it so that it
 * can be sent to the client without any circular references.
 *
 * @param schema The `FlowSchema` object to serialize.
 * @returns The serialized version of the `FlowSchema` object.
 */
export function serializeFlowSchema(schema?: MaybeFunction<MaybePromise<FlowSchema>, any[]>): FlowNodePortJSON[] {
  if (!schema) return []
  if (typeof schema === 'function') return []
  if (schema instanceof Promise) return []

  // --- Map the schema object to an array of serialized ports.
  return Object.entries(schema).map(([key, port]) => ({
    key,
    name: port.name ?? key,
    typeKind: port.type?.kind,
    typeName: port.type?.name,
    typeColor: port.type?.color,
    typeDescription: port.type?.description,
    display: port.display,
    description: port.description,
    defaultValue: port.defaultValue,
    disallowStatic: port.disallowStatic,
    disallowDynamic: port.disallowDynamic,
    values: serializeFlowNodePortValues(port.values),
    numberMax: port.numberMax,
    numberMin: port.numberMin,
    numberStep: port.numberStep,
  }))
}
