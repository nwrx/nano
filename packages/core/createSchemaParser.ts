import type { SchemaLike } from '@unshared/validation'
import type { FlowNodePort, FlowSchema } from './defineFlowNode'
import type { InferSchemaType } from './types'
import { createParser } from '@unshared/validation'

/**
 * Create a parser out of a `Schema` type. The parser is used to parse the
 * value of the schema and to validate the value of the schema.
 *
 * @param schema The schema to create a parser from.
 * @returns The parser created from the schema.
 */
export function createSchemaParser<T extends FlowSchema>(schema: T): (value: unknown) => InferSchemaType<T> {
  const parser = {} as SchemaLike

  // --- Create a parser for each property in the schema.
  for (const key in schema) {
    const port = schema[key] as FlowNodePort
    if (typeof port.type?.parse !== 'function') continue
    parser[key] = port.type.parse
  }

  return createParser(parser) as (value: unknown) => InferSchemaType<T>
}
