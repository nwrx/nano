import type { DataSchema, SocketControl, SocketOption } from '@nwrx/core'
import type { MaybeFunction, MaybeLiteral, MaybePromise } from '@unshared/types'
import type { ResultSocketJSON } from './serializeResultSchema'
import { serializeSocketOptions } from './serializeSocketOptions'

export interface DataSocketJSON extends ResultSocketJSON {
  control?: MaybeLiteral<SocketControl>
  options?: SocketOption[]
  sliderMax?: number
  sliderMin?: number
  sliderStep?: number
}

/**
 * Given a `DataSchema` object, returns a serialized version of it so that it
 * can be sent to the client without any circular references or private data.
 *
 * @param schema The `DataSchema` object to serialize.
 * @returns The serialized version of the `DataSchema` object.
 */
export function serializeDataSchema(schema?: MaybeFunction<MaybePromise<DataSchema>, any[]>): DataSocketJSON[] {
  if (!schema) return []
  if (typeof schema === 'function') return []
  if (schema instanceof Promise) return []

  // --- Map the schema object to an array of serialized ports.
  return Object.entries(schema).map(([key, socket]) => ({
    key,
    name: socket.name ?? key,
    typeKind: socket.type?.kind,
    typeName: socket.type?.name,
    typeColor: socket.type?.color,
    typeDescription: socket.type?.description,
    control: socket.control,
    description: socket.description,
    options: serializeSocketOptions(socket.options),
    sliderMax: socket.sliderMax,
    sliderMin: socket.sliderMin,
    sliderStep: socket.sliderStep,
  }))
}
