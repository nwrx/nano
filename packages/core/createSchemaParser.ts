import type { SchemaLike } from '@unshared/validation'
import type { FlowSchema } from './defineFlowNode'
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
  for (const key in schema) parser[key] = schema[key].type.parse
  return createParser(parser) as unknown as (value: unknown) => InferSchemaType<T>
}
