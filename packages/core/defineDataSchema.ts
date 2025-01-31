import type { IsNever, MaybeLiteral, NotUndefined } from '@unshared/types'
import type { ResultSocket } from './defineResultSchema'
import type { Type } from './defineType'
import type { ObjectLike } from './types'

/**
 * Enum-like type representing the various control types a socket can have in the editor.
 */
export type SocketControl =
  | 'autocomplete'
  | 'radio'
  | 'select'
  | 'slider'
  | 'socket'
  | 'stream'
  | 'text'
  | 'textarea'
  | 'variable'

/**
 * Interface for defining options for sockets with 'autocomplete' or 'select' controls.
 * Each option includes a value and a label, with optional icon and description for enhanced UX.
 */
export interface SocketListOption<T = unknown> {

  /** Internal value of the option. */
  value: T

  /** Display label for the option in the editor. */
  label: string

  /** Optional icon to visually represent the option. */
  icon?: string

  /** Optional description providing additional context for the option. */
  description?: string
}

/**
 * Interface representing a data socket, which can connect to another node in the flow.
 * It includes type validation and parsing logic for the data passed through the socket.
 */
export type DataSocket<
  T = any,
  O extends boolean | undefined = boolean | undefined,
  A extends boolean | undefined = boolean | undefined,
> = {

  /**
   * Control type of the socket, dictating its appearance and input method in the editor.
   * - `autocomplete`: Select from a list via autocomplete.
   * - `select`: Select from a list via dropdown.
   * - `slider`: Select a value from a range via slider.
   * - `socket`: Connect to another node.
   * - `stream`: Stream data from another node.
   * - `text`: Enter a string value.
   * - `textarea`: Enter a multi-line string.
   * - `toggle`: Enable or disable a value.
   * - `variable`: Select a variable from the project.
   */
  control?: MaybeLiteral<SocketControl>

  /**
   * Options for 'autocomplete' or 'select' controls.
   * Can be an array of strings or objects with `value` and `label` properties.
   *
   * @example
   * [
   *   { label: 'Red', value: '#ff0000' },
   *   { label: 'Green', value: '#00ff00' },
   *   { label: 'Blue', value: '#0000ff' },
   * ]
   */
  options?: NoInfer<Array<SocketListOption<T> | string & T>>

  /**
   * Maximum value for a 'slider' control. Ignored if control is not 'slider'.
   *
   * @default 100
   */
  sliderMax?: number

  /**
   * Minimum value for a 'slider' control. Ignored if control is not 'slider'.
   *
   * @default 0
   */
  sliderMin?: number

  /**
   * Step value for a 'slider' control. Ignored if control is not 'slider'.
   *
   * @default 1
   */
  sliderStep?: number

  /**
   * Placeholder text displayed in the editor when the socket is empty.
   */
  placeholder?: string

  /**
   * Default value for the data is not provided during execution. Note that this value
   * will take precedence over the default value provided by the socket type.
   */
  defaultValue?: NoInfer<T>
} & ResultSocket<T, O, A>

/**
 * Type representing the schema for a node's data, mapping socket names to their configurations.
 * This schema is used to validate the data passed to the node during execution.
 */
export type DataSchema<T extends ObjectLike = never> =
  IsNever<T> extends true
    ? Record<string, DataSocket>
    : { [P in keyof T as undefined extends T[P] ? never : P & string]-?: DataSocket<T[P], false | undefined> } &
      { [P in keyof T as undefined extends T[P] ? P & string : never]-?: DataSocket<NotUndefined<T[P]>, true> }

/**
 * Extract the raw type described by the given schema instance.
 *
 * @template T The schema instance to extract the type from.
 * @example
 * // The schema.
 * type Schema = {
 *   value: { type: Type<string> }
 *   other: { type: Type<number>; isOptional: true }
 * }
 *
 * // The extracted type.
 * type Type = DataFromSchema<Schema>
 * // {
 * //   value: string
 * //   other?: number
 * // }
 */
export type DataFromSchema<T extends DataSchema> =
  { [P in keyof T]:
    T[P] extends { type: Type<infer U>; isOptional: true; isArray: true } ? U[] | undefined :
      T[P] extends { type: Type<infer U>; isOptional: true } ? U | undefined :
        T[P] extends { type: Type<infer U>; isArray: true } ? U[] :
          T[P] extends { type: Type<infer U> } ? U : never
  }

/**
 * Function to define a schema for a node's data, mapping socket names to their configurations.
 * This schema is used to inform the editor of the expected data structure for the node but
 * also to parse and validate the data during execution.
 *
 * @param schema The schema defining the node's data structure.
 * @returns The validated schema for the node's data.
 * @example
 * import { string, number } from '@nwrx/module-core'
 *
 * const schema = dataSchema({
 *   value: { type: string, name: 'Value', description: 'The value to process.' },
 *   other: { type: number, name: 'Other', description: 'Another value to process.' },
 * })
 */
export function defineDataSchema<T extends DataSchema>(schema: T): T
export function defineDataSchema<T extends ObjectLike>(schema: DataSchema<T>): DataSchema<T>
export function defineDataSchema(schema: DataSchema): DataSchema {
  return schema
}
