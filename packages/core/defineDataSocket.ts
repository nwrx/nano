import type { MaybeLiteral } from '@unshared/types'
import type { ResultSocket } from './defineResultSocket'

/**
 * Describes the type of control the socket has in the editor.
 */
export type SocketControl =
  | 'autocomplete'
  | 'select'
  | 'slider'
  | 'socket'
  | 'stream'
  | 'text'
  | 'textarea'
  | 'toggle'
  | 'variable'

/**
 * Represents an option for a socket with a control of `autocomplete` or `select`.
 * Each option contains a value and a label displayed to the user in the editor.
 * It can also include an optional icon and description for further clarification.
 */
export interface SocketOption<T = unknown> {

  /** The internal value of the option. */
  value: T

  /** The label displayed in the editor. */
  label: string

  /** The optional icon displayed next to the option in the editor. */
  icon?: string

  /** The optional description displayed in the editor. */
  description?: string
}

/**
 * Defines a socket that can be used to connect to another node in the flow.
 * The socket contains a type that is used to validate the data that is passed
 * to the socket and to provide information about the type of the data that is
 * expected. It contains a `parser` function that is used to parse and validate
 * the data that is passed to the socket.
 */
export interface DataSocket<T = unknown> extends ResultSocket<T> {

  /**
   * Specifies the control type of the port, determining how it is displayed in the editor
   * and the type of input expected from the user.
   *
   * - `autocomplete` - Allows the user to select from a list of values via an autocomplete input.
   * - `select` - Allows the user to select from a list of values via a select input.
   * - `slider` - Allows the user to select a value from a range via a slider input.
   * - `socket` - Allows the user to connect to another node via a socket input.
   * - `stream` - Allows the user to stream data from another node via a stream input.
   * - `text` - Allows the user to enter a string value via a text input.
   * - `textarea` - Allows the user to enter a multi-line string value via a textarea input.
   * - `toggle` - Allows the user to enable or disable a value via a toggle input.
   * - `variable` - Allows the user to select a variable from the project via a variable input.
   */
  control?: MaybeLiteral<SocketControl>

  /**
   * Defines the selectable options for `autocomplete` or `select` controls.
   * Options can be a list of strings or objects with `value` and `label` properties.
   *
   * @example
   * [
   *   { label: 'Red', value: '#ff0000' },
   *   { label: 'Green', value: '#00ff00' },
   *   { label: 'Blue', value: '#0000ff' },
   * ]
   */
  options?: Array<NoInfer<T> & string> | Array<SocketOption<NoInfer<T>>>

  /**
   * The maximum value for a `slider` control. Ignored if the control is not a `slider`.
   *
   * @default 100
   */
  sliderMax?: number

  /**
   * The minimum value for a `slider` control. Ignored if the control is not a `slider`.
   *
   * @default 0
   */
  sliderMin?: number

  /**
   * The step value for a `slider` control. Ignored if the control is not a `slider`.
   *
   * @default 1
   */
  sliderStep?: number

  /**
   * Indicates whether the port is required to have a value when the node is executed.
   * If true, the node will not run until this port and all other required ports have values.
   *
   * @default false
   */
  required?: boolean
}

/**
 * Defines the schema for the data of a flow node, containing a mapping of
 * the data ports available on the node. These ports define the data expected
 * by the node during processing.
 */
export type DataSchema = Record<string, DataSocket>

/**
 * Defines a socket that can be used to connect to another node in the flow.
 * The socket contains a type that is used to validate the data that is passed
 * to the socket and to provide information about the type of the data that is
 * expected. It contains a `parser` function that is used to parse and validate
 * the data that is passed to the socket.
 *
 * @param socket The socket that is used to connect to another node in the flow.
 * @returns The socket that is used to connect to another node in the flow.
 * @example
 * const socket = defineDataSocket({
 *   type: string,
 *   name: 'Name',
 *   description: 'The name of the user.',
 *   control: 'socket',
 * })
 */
export function defineDataSocket<T = unknown>(socket: DataSocket<T>): DataSocket<T> {
  return socket
}
