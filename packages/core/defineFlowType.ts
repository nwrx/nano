import type { MaybeFunction } from '@unshared/types'
import { assertNotNil, assertStringNotEmpty } from '@unshared/validation'

/**
 * A flow type defines the type of a value in the flow. The type is used to
 * validate the value and provide information about the type in the flow editor.
 *
 * @template T The internal type of the flow type.
 * @example type TypePrimitiveString = FlowType<string> // { parse: (value: unknown) => string, ... }
 */
export interface FlowType<T = unknown> {

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
export function defineFlowType<T>(options: FlowType<T>): FlowType<T> {
  assertNotNil(options)
  assertStringNotEmpty(options.kind)
  return {
    kind: options.kind,
    name: options.name ?? options.kind,
    color: options.color,
    description: options.description,
    parse: options.parse,
    defaultValue: options.defaultValue,
  }
}

/* v8 ignore start */
if (import.meta.vitest) {
  describe('defineFlowType', () => {
    it('should define a flow type with the given options', () => {
      const parse = vi.fn()
      const type = defineFlowType({
        kind: 'type-id',
        name: 'String',
        color: '#ff0000',
        parse,
        description: 'The string type.',
        defaultValue: 'Hello, World!',
      })

      expect(type).toStrictEqual({
        kind: 'type-id',
        name: 'String',
        color: '#ff0000',
        parse,
        description: 'The string type.',
        defaultValue: 'Hello, World!',
      })
    })

    it('should define a flow type with minimal options', () => {
      const parse = vi.fn()
      const type = defineFlowType({ kind: 'type-id', parse })

      expect(type).toStrictEqual({
        kind: 'type-id',
        name: 'type-id',
        color: undefined,
        parse,
        description: undefined,
        defaultValue: undefined,
      })
    })

    it('should not return the same object', () => {
      const object = { kind: 'type-id', parse: vi.fn() }
      const type = defineFlowType(object)
      expect(type).not.toBe(object)
    })
  })

  describe('error cases', () => {
    it('should throw an error if options is undefined', () => {
    // @ts-expect-error: test invalid input
      const shouldThrow = () => defineFlowType()
      expect(shouldThrow).toThrow('Expected value not to be null or undefined')
    })

    it('should throw an error if the kind is undefined', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineFlowType({ kind: undefined })
      expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
    })

    it('should throw an error if the kind is null', () => {
      // @ts-expect-error: test invalid input
      // eslint-disable-next-line unicorn/no-null
      const shouldThrow = () => defineFlowType({ kind: null })
      expect(shouldThrow).toThrow('Expected value to be a string but received: null')
    })

    it('should throw an error if the kind is an empty string', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineFlowType({ kind: '' })
      expect(shouldThrow).toThrow('Expected value to be a non-empty string but received an empty string')
    })

    it('should throw an error if the kind is not a string', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineFlowType({ kind: 123 })
      expect(shouldThrow).toThrow('Expected value to be a string but received: number')
    })
  })

  describe('type inference', () => {
    it('should return the type of a flow type', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const type = defineFlowType({ kind: 'type-id', parse: (): string => '' })
      expectTypeOf<InferType<typeof type>>().toEqualTypeOf<string>()
    })

    it('should infer the type of a flow type', () => {
      type Type = FlowType<string>
      type Result = InferType<Type>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })
  })
}
