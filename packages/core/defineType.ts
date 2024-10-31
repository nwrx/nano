import type { Loose } from '@unshared/types'
import { assert, createSchema, ValidationError } from '@unshared/validation'

/** The parser schema for the type. */
const PARSE_TYPE = createSchema({

  /**
   * The internal kind of the type for identification purposes.
   * This should be unique across all types.
   *
   * @example 'number'
   */
  kind: [
    assert.notNil.with('You must provide a kind for the type.'),
    assert.string.with('The kind of the type must be a string.'),
    assert.stringNotEmpty.with('The kind of the type must be a non-empty string.'),
    assert.stringKebabCase.with('The kind of the type must be kebab-case.'),
  ],

  /**
   * A function that parses a value of the type from an unknown
   * value. The function should throw an error if the value is
   * invalid for the type.
   *
   * @example (value) => {
   *   if (typeof value !== 'number') throw new Error('The value must be a number.')
   *   return value
   * }
   */
  parse: [
    assert.notNil.with('You must provide a parse function for the type.'),
    assert.function.with('The parse function must be a function.'),
  ],

  /**
   * The name of the type that is displayed to the user in the UI.
   * It should be human-readable and concise.
   *
   * @example 'Number'
   */
  name: [[assert.undefined], [
    assert.string.with('The name of the type must be a string.'),
    assert.stringNotEmpty.with('The name of the type must be a non-empty string.'),
  ]],

  /**
   * An URL to an icon that represents the type in the UI. The icon
   * should be a square image with a transparent background.
   *
   * @example 'https://api.iconify.design/carbon:number.svg'
   */
  color: [[assert.undefined], [
    assert.string.with('The color of the type must be a string.'),
    assert.stringMatching(/^#[\dA-Fa-f]{6}$/).with('The color of the type must be a hexadecimal color code.'),
  ]],

  /**
   * A paragraph of text that describes the type and its purpose
   * to the user. It should be concise and informative.
   *
   * @example 'A numeric value.'
   */
  description: [[assert.undefined], [
    assert.string.with('The description of the type must be a string.'),
    assert.stringNotEmpty.with('The description of the type must be a non-empty string.'),
  ]],

  /**
   * The default value of the type. The default value should be
   * valid for the type and should be used when the value is not
   * provided by the user.
   *
   * @example 0
   */
  defaultValue: [[assert.undefined], [
    assert.notNull.with('The default value can be any type.'),
  ]],
})

/** A type that represents a specific kind of value. */
export type Type<T = unknown> = { parse: (value: unknown) => T } & Loose<ReturnType<typeof PARSE_TYPE>>

/**
 * Defines a new `Type` that represents a specific kind of value.
 *
 * @param options The options to define the type.
 * @returns The defined type.
 */
export function defineType<T>(options: Readonly<Type<T>>): Type<T> {
  try {
    return PARSE_TYPE({ ...options, name: options.name ?? options.kind }) as Type<T>
  }
  catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.context as Record<string, Error | ValidationError>
      for (const key in errors) {
        if (errors[key] instanceof ValidationError) {
          if (errors[key].name === 'E_RULE_SET_MISMATCH')
            throw errors[key].context[0]
          throw errors[key]
        }
      }
    }
    throw error
  }
}
