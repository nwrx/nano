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

/* v8 ignore start */
if (import.meta.vitest) {
  const { typeString, typeNumber } = await import('./__fixtures__')

  test('should create a schema parser when the port has a type', () => {
    const parser = createSchemaParser({ string: { type: typeString } })
    const value = parser({ string: 'Hello, World!' })
    expect(value).toStrictEqual({ string: 'Hello, World!' })
  })

  test('should return an empty object when the schema is empty', () => {
    const parser = createSchemaParser({})
    const value = parser({})
    expect(value).toStrictEqual({})
  })

  test('should infer the type of the value', () => {
    const parser = createSchemaParser({
      string: {
        name: 'String',
        type: typeString,
        description: 'A string value.',
      },
      number: {
        name: 'Number',
        type: typeNumber,
        description: 'A number value.',
      },
    })
    const value = parser({
      string: 'Hello, World!',
      number: 42,
      boolean: true,
    })
    expectTypeOf(value).toEqualTypeOf<{
      string: string
      number: number
    }>()
  })
}
