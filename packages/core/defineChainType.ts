import { ValidationError, assertStringNotEmpty } from 'unshared'

/**
 * A chain type defines the type of a value in the chain. The type is used to
 * validate the value and provide information about the type in the chain editor.
 *
 * @template T The internal type of the chain type.
 * @example type TypePrimitiveString = ChainType<string> // { parse: (value: unknown) => string, ... }
 */
export interface ChainType<T = any> {

  /**
   * A unique identifier of the type. The identifier is used to identify the
   * type in the chain editor.
   */
  name: string

  /**
   * The name of the type. The name is used to identify the type in the chain
   * editor.
   *
   * @example 'String'
   */
  label: string

  /**
   * Validate the value of the type. If the value is invalid, then an error
   * is thrown.
   *
   * @param value The value to validate.
   * @example assertString('Hello, World!')
   */
  parse: (value: unknown) => T

  /**
   * The color of the type. The color is used to visually identify the type
   * in the chain editor.
   *
   * @example '#3bcf3b'
   */
  color?: string

  /**
   * Description of the type. The description is used to provide more
   * information about the type in the chain editor.
   */
  description?: string

  /**
   * The default value of the type. The default value is used when the value
   * of the type is not provided.
   *
   * @example 'Hello, World!'
   */
  defaultValue?: T | undefined

  /**
   * Convert the type to a string.
   */
  toString(): string
}

/**
 * Create a chain type with the given options. The options must contain a
 * unique identifier, a name, and a parser to validate and parse the value.
 *
 * @param options The options to create the chain type.
 * @returns The chain type created with the given options.
 * @example
 * const TypePrimitiveString = defineChainType({
 *   name: 'primitive:string',
 *   label: 'String',
 *   parse: (value: unknown) => {
 *     if (typeof value === 'string') return value
 *     throw new Error('Expected value to be a string.')
 *   },
 * })
 */
export function defineChainType<T>(options: ChainType<T>): ChainType<T> {
  assertStringNotEmpty(options.name)
  assertStringNotEmpty(options.label)
  return {
    name: options.name,
    label: options.label,
    color: options.color ?? '#000000',
    parse: options.parse,
    description: options.description,
    defaultValue: options.defaultValue,
    toString() { return options.name },
  }
}

/* v8 ignore start */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
if (import.meta.vitest) {
  const { assertString, createParser } = await import('unshared')

  test('should define a chain type', () => {
    const type = defineChainType({
      name: 'type-id',
      label: 'String',
      parse: createParser(assertString),
    })

    expect(type).toStrictEqual({
      name: 'type-id',
      label: 'String',
      color: '#000000',
      parse: expect.any(Function),
      description: undefined,
      defaultValue: undefined,
      toString: expect.any(Function),
    })
  })

  test('should define a chain type with a color', () => {
    const type = defineChainType({
      name: 'type-id',
      label: 'String',
      color: '#3bcf3b',
      parse: createParser(assertString),
    })

    expect(type).toStrictEqual({
      name: 'type-id',
      label: 'String',
      color: '#3bcf3b',
      parse: expect.any(Function),
      description: undefined,
      defaultValue: undefined,
      toString: expect.any(Function),
    })
  })

  test('should define a chain type with all the options', () => {
    const type = defineChainType({
      name: 'type-id',
      label: 'String',
      color: '#ff0000',
      parse: createParser(assertString),
      description: 'The string type.',
      defaultValue: 'Hello, World!',
    })

    expect(type).toStrictEqual({
      name: 'type-id',
      label: 'String',
      color: '#ff0000',
      parse: expect.any(Function),
      description: 'The string type.',
      defaultValue: 'Hello, World!',
      toString: expect.any(Function),
    })
  })

  test('should throw an error if the id is empty', () => {
    const shouldThrow = () => defineChainType({ name: '', label: 'String', parse: createParser(assertString) })
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a non-empty string but received an empty string.')
  })

  test('should throw an error if the name is empty', () => {
    const shouldThrow = () => defineChainType({ name: 'type-id', label: '', parse: createParser(assertString) })
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to be a non-empty string but received an empty string.')
  })

  test('should parse the value of the type', () => {
    const type = defineChainType({
      name: 'type-id',
      label: 'String',
      parse: createParser(assertString),
    })

    const result = type.parse('Hello, World!')
    expect(result).toBe('Hello, World!')
    expectTypeOf(result).toEqualTypeOf<string>()
  })
}
