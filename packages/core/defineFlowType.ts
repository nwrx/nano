import type { MaybeFunction } from '@unshared/types'
import { assertStringNotEmpty, ValidationError } from '@unshared/validation'

export interface FlowTypeCast<T = any, U = any> {
  type: FlowType<U>
  from: (value: T) => U
  to: (value: U) => T
}

/**
 * A flow type defines the type of a value in the flow. The type is used to
 * validate the value and provide information about the type in the flow editor.
 *
 * @template T The internal type of the flow type.
 * @example type TypePrimitiveString = FlowType<string> // { parse: (value: unknown) => string, ... }
 */
export interface FlowTypeOptions<T = unknown, U = unknown> {

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

  /**
   * Cast the value of the type to another type. The cast is used to convert
   * the value of the type to another type.
   */
  casts?: Array<FlowTypeCast<T, U>>
}

/**
 * The serialized representation of a flow type.
 */
export interface FlowTypeJSON {
  kind: string
  name: string
  color: string
  description?: string
}

/**
 * A flow type defines the type of a value in the flow. The type is used to
 * validate the value and provide information about the type in the flow editor.
 *
 * @template T The internal type of the flow type.
 * @example type TypePrimitiveString = FlowType<string> // { parse: (value: unknown) => string, ... }
 */
export interface FlowType<T = unknown, U = unknown> extends
  Pick<Required<FlowTypeOptions<T, U>>, 'casts' | 'color' | 'name'>,
  Omit<FlowTypeOptions<T, U>, 'casts' | 'color' | 'name'> {

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
export type InferType<T> = T extends FlowType<infer U, any> ? U : never

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
export function defineFlowType<T, U>(options: FlowTypeOptions<T, U>): FlowType<T, U> {
  assertStringNotEmpty(options.kind)
  return {
    kind: options.kind,
    name: options.name ?? options.kind,
    color: options.color ?? '#000000',
    description: options.description,
    parse: options.parse,
    casts: options.casts ?? [],
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
  const { typeString } = await import('./__fixtures__')

  test('should define a flow type', () => {
    const type = defineFlowType({
      kind: 'type-id',
      parse: createParser(assertString),
    })

    expect(type).toStrictEqual({
      kind: 'type-id',
      name: 'type-id',
      color: '#000000',
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
      parse: createParser(assertNumber),
      casts: [{
        type: typeString,
        from: value => value.toFixed(2),
        to: value => Number.parseFloat(value),
      }],
    })

    const result = type.casts[0].from(3.14159)
    expect(result).toBe('3.14')
  })

  test('should cast from one type to another', () => {
    const type = defineFlowType({
      kind: 'number',
      name: 'Number',
      defaultValue: 0,
      parse: createParser(assertNumber),
      casts: [{
        type: typeString,
        from: value => value.toFixed(2),
        to: value => Number.parseFloat(value),
      }],
    })

    const result = type.casts[0].to('3.14')
    expect(result).toBe(3.14)
  })
}
