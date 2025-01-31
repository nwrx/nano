import type { MaybeFunction } from '@unshared/types'
import { assertNotNil, assertStringNotEmpty } from '@unshared/validation'

/**
 * A flow type defines the type of a value in the flow. The type is used to
 * validate the value and provide information about the type in the flow editor.
 *
 * @template T The internal type of the flow type.
 * @example type TypePrimitiveString = Type<string> // { parse: (value: unknown) => string, ... }
 */
export interface Type<T = unknown> {

  /**
   * A unique identifier of the type. The identifier is used to identify the
   * type in the flow editor. It should be
   */
  kind: string

  /**
   * Validate the value of the type. If the value is invalid, then an error
   * is thrown.
   *
   * @param value The value to validate.
   * @example assertString('Hello, World!')
   */
  parse: (value: unknown) => T

  /**
   * The display name of the type. The name is used to identify the type in
   * the flow editor and should be readable and descriptive.
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
   * The default value of the type. The default value is used when the value
   * of the type is not provided.
   *
   * @example 'Hello, World!'
   */
  defaultValue?: MaybeFunction<NoInfer<T>>
}

/**
 * Create a flow type with the given options. The options must contain a
 * unique identifier, a name, and a parser to validate and parse the value.
 *
 * @param options The options to create the flow type.
 * @returns The flow type created with the given options.
 * @example
 * const TypePrimitiveString = defineType({
 *   name: 'primitive:string',
 *   label: 'String',
 *   parse: (value: unknown) => {
 *     if (typeof value === 'string') return value
 *     throw new Error('Expected value to be a string.')
 *   },
 * })
 */
export function defineType<T>(options: Type<T>): Type<T> {
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
