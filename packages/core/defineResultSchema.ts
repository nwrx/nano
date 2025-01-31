import type { IsNever, Loose, NotUndefined } from '@unshared/types'
import type { Type } from './defineType'
import type { ObjectLike } from './types'

/**
 * Represents a socket in a flow node that outputs data. This type allows the definition
 * of the socket's label, type, and other metadata, ensuring that the output data conforms
 * to the expected structure and type.
 *
 * @template T The type of data that the socket will output.
 * @template O A boolean indicating whether the socket is optional.
 */
export type ResultSocket<T = unknown, O extends boolean | undefined = boolean | undefined> = Loose<{

  /**
   * The type of the socket. This is used to validate the data passed to the socket
   * and to provide information about the expected data type. It includes a `parser`
   * function to parse and validate the data.
   *
   * @example
   * // Define a custom type for an email address.
   * const typeEmail = defineType({
   *   kind: 'email',
   *   name: 'Email',
   *   color: '#3498db',
   *   description: 'A valid email address as per the RFC 5322 standard.',
   *   parser: (value) => {
   *     const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
   *     if (!isEmail) throw new Error('The value is not a valid email address.')
   *     return value
   *   },
   * })
   *
   * // Or use built-in types.
   * import { string } from '@nwrx/module-core'
   */
  type: Type<T>

  /**
   * The display name of the socket. This is used to identify the socket in the
   * editor and should be human-readable and descriptive.
   *
   * @example 'Email Address'
   */
  name?: string

  /**
   * A description of the socket. This provides additional information about the
   * socket and the expected data. It is shown as a tooltip in the editor.
   *
   * @example 'The email address of the user.'
   */
  description?: string

  /**
   * Indicates whether the socket is optional. If true, the node can execute without
   * a value for this socket, provided all other required sockets have values.
   *
   * @default false
   */
  isOptional: O
}>

/**
 * Defines the schema for a node's result, mapping socket names to their configurations.
 * This schema is used to validate the result data passed to the node during execution.
 *
 * @template T An object representing the expected structure of the result data.
 */
export type ResultSchema<T extends ObjectLike = never> =
  IsNever<T> extends true
    ? Record<string, ResultSocket>
    : { [P in keyof T as undefined extends T[P] ? never : P & string]-?: ResultSocket<T[P], false | undefined> } &
    { [P in keyof T as undefined extends T[P] ? P & string : never]-?: ResultSocket<NotUndefined<T[P]>, true> }

/**
 * Extracts the raw type described by the given schema instance.
 *
 * @template T The schema instance to extract the type from.
 * @example
 * // Define a schema.
 * type Schema = {
 *   value: { type: Type<string> }
 *   other: { type: Type<number>; isOptional: true }
 * }
 *
 * // Extract the type.
 * type ExtractedType = ResultFromSchema<Schema>
 * // {
 * //   value: string
 * //   other?: number
 * // }
 */
export type ResultFromSchema<T extends ResultSchema> =
  { [P in keyof T]:
    T[P] extends { type: Type<infer U>; isOptional: true } ? U | undefined :
      T[P] extends { type: Type<infer U> } ? U : never
  }

/**
 * Defines a schema for a node's result, mapping socket names to their configurations.
 * This schema informs the editor of the expected result structure and validates the
 * result data during execution.
 *
 * @param socket The schema defining the node's result structure.
 * @returns The validated schema for the node's result.
 * @example
 * import { string, number } from '@nwrx/module-core'
 *
 * const resultSchema = defineResultSchema({
 *   value: { type: string, label: 'Value', description: 'The value to process.' },
 *   other: { type: number, label: 'Other', description: 'Another value to process.', isOptional: true },
 * })
 */
export function defineResultSchema<T extends ResultSchema>(socket: T): T
export function defineResultSchema<T>(socket: ResultSocket<T>): ResultSocket<T>
export function defineResultSchema(socket: ResultSocket): ResultSocket {
  return socket
}
