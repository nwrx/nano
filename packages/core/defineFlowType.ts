import type { MaybeFunction } from '@unshared/types'
import { assertStringNotEmpty, assertStringNumber, ValidationError } from '@unshared/validation'

/**
 * A flow type defines the type of a value in the flow. The type is used to
 * validate the value and provide information about the type in the flow editor.
 *
 * @template T The internal type of the flow type.
 * @example type TypePrimitiveString = FlowType<string> // { parse: (value: unknown) => string, ... }
 */
export interface FlowTypeOptions<T = unknown> {

  /**
   * A unique identifier of the type. The identifier is used to identify the
   * type in the flow editor. It should be
   */
  kind: string

  /**
   * The name of the type. The name is used to identify the type in the flow
   * editor.
   *
   * @example 'String'
   */
  name?: string

  /**
   * The color of the type. The color is used to visually identify the type
   * in the flow editor.
   *
   * @example '#3bcf3b'
   */
  color?: string

  /**
   * Description of the type. The description is used to provide more
   * information about the type in the flow editor.
   */
  description?: string

  /**
   * Validate the value of the type. If the value is invalid, then an error
   * is thrown.
   *
   * @param value The value to validate.
   * @example assertString('Hello, World!')
   */
  parse: (value: unknown) => T

  /**
   * The default value of the type. The default value is used when the value
   * of the type is not provided.
   *
   * @example 'Hello, World!'
   */
  defaultValue?: MaybeFunction<T>
}

/**
 * The serialized representation of a flow type.
 */
export interface FlowTypeJSON {
  kind: string
  name?: string
  color?: string
  description?: string
}

/**
 * A flow type defines the type of a value in the flow. The type is used to
 * validate the value and provide information about the type in the flow editor.
 *
 * @template T The internal type of the flow type.
 * @example type TypePrimitiveString = FlowType<string> // { parse: (value: unknown) => string, ... }
 */
export interface FlowType<T = unknown> extends FlowTypeOptions<T> {

  /**
   * Convert the type to a string.
   */
  toString(): string

  /**
   * Serialize the type to JSON.
   */
  toJSON(): FlowTypeJSON
}

/**
 * Extract the type of the given `FlowType` instance.
 *
 * @template T The `FlowType` instance to extract the type from.
 * @example
 * type Type = FlowType<string>
 * type Result = InferType<Type> // string
 */
export type InferType<T> = T extends FlowType<infer U> ? U : never

/**
 * Create a flow type with the given options. The options must contain a
 * unique identifier, a name, and a parser to validate and parse the value.
 *
 * @param options The options to create the flow type.
 * @returns The flow type created with the given options.
 * @example
 * const TypePrimitiveString = defineFlowType({
 *   name: 'primitive:string',
 *   label: 'String',
 *   parse: (value: unknown) => {
 *     if (typeof value === 'string') return value
 *     throw new Error('Expected value to be a string.')
 *   },
 * })
 */
export function defineFlowType<T>(options: FlowTypeOptions<T>): FlowType<T> {
  assertStringNotEmpty(options.kind)
  return {
    kind: options.kind,
    name: options.name,
    color: options.color,
    description: options.description,
    parse: options.parse,
    defaultValue: options.defaultValue!,
    toString() { return options.kind },
    toJSON() {
      return {
        kind: this.kind,
        name: this.name,
        color: this.color,
        description: this.description,
      }
    },
  }
}

/* v8 ignore start */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
if (import.meta.vitest) {
  const { assertString, assertNumber, createParser } = await import('@unshared/validation')

  test('should define a flow type', () => {
    const type = defineFlowType({
      kind: 'type-id',
      parse: createParser(assertString),
    })

    expect(type).toStrictEqual({
      kind: 'type-id',
      name: undefined,
      color: undefined,
      parse: expect.any(Function),
      description: undefined,
      defaultValue: undefined,
      toString: expect.any(Function),
      toJSON: expect.any(Function),
    })
  })

  test('should define a flow type with a color', () => {
    const type = defineFlowType({
      kind: 'type-id',
      name: 'String',
      color: '#3bcf3b',
      parse: createParser(assertString),
    })

    expect(type).toStrictEqual({
      kind: 'type-id',
      name: 'String',
      color: '#3bcf3b',
      parse: expect.any(Function),
      description: undefined,
      defaultValue: undefined,
      toString: expect.any(Function),
      toJSON: expect.any(Function),
    })
  })

  test('should define a flow type with all the options', () => {
    const type = defineFlowType({
      kind: 'type-id',
      name: 'String',
      color: '#ff0000',
      parse: createParser(assertString),
      description: 'The string type.',
      defaultValue: 'Hello, World!',
    })

    expect(type).toStrictEqual({
      kind: 'type-id',
      name: 'String',
      color: '#ff0000',
      parse: expect.any(Function),
      description: 'The string type.',
      defaultValue: 'Hello, World!',
      toString: expect.any(Function),
      toJSON: expect.any(Function),
    })
  })

  test('should throw an error if the id is empty', () => {
    const shouldThrow = () => defineFlowType({ kind: '', name: 'String', parse: createParser(assertString) })
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a non-empty string but received an empty string.')
  })

  test('should parse the value of the type', () => {
    const type = defineFlowType({
      kind: 'type-id',
      name: 'String',
      parse: createParser(assertString),
    })

    const result = type.parse('Hello, World!')
    expect(result).toBe('Hello, World!')
    expectTypeOf(result).toEqualTypeOf<string>()
  })

  test('should return the name of the type when stringified', () => {
    const type = defineFlowType({
      kind: 'type-id',
      name: 'String',
      defaultValue: '',
      parse: createParser(assertString),
    })

    const result = type.toString()
    expect(result).toBe('type-id')
    expectTypeOf(result).toEqualTypeOf<string>()
  })

  test('should serialize the type', () => {
    const type = defineFlowType({
      kind: 'type-id',
      name: 'String',
      defaultValue: 'Default value',
      parse: createParser(assertString),
    })

    const result = type.toJSON()
    expect(result).toStrictEqual({
      kind: 'type-id',
      name: 'String',
      color: '#000000',
      description: undefined,
    })
  })

  test('should infer the type of a flow type', () => {
    type Type = FlowType<string>
    type Result = InferType<Type>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  test('should cast from one type to another', () => {
    const type = defineFlowType({
      kind: 'number',
      name: 'Number',
      defaultValue: 0,
      parse: createParser(
        [assertNumber],
        [assertStringNumber, Number.parseFloat],
      ),
    })

    const result = type.parse('3.14')
    expect(result).toBe(3.14)
  })
}
