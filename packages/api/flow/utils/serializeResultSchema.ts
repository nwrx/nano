import type { DataSchema } from '@nwrx/core'
import type { MaybeFunction, MaybePromise } from '@unshared/types'

export interface ResultSocketJSON {
  key: string
  name: string
  typeKind: string
  typeName?: string
  typeColor?: string
  typeDescription?: string
  description?: string
}

/**
 * Given a `ResultSchema` object, returns a serialized version of it so that it
 * can be sent to the client without any circular references or private data.
 *
 * @param schema The `ResultSchema` object to serialize.
 * @returns The serialized version of the `ResultSchema` object.
 */
export function serializeResultSchema(schema?: MaybeFunction<MaybePromise<DataSchema>, any[]>): ResultSocketJSON[] {
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
    description: socket.description,
  }))
}
