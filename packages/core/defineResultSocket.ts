import type { SocketType } from './defineSocketType'

/**
 * A schema that contains the ports of a flow. It allows the definition of
 * the label as well as the type of the socket that is used in the flow.
 */
export interface ResultSocket<T = unknown> {

  /**
   * The type of the socket. The type is used to validate the result that is passed
   * to the socket and to provide information about the type of the result that is
   * expected. It contains a `parser` function that is used to parse and validate
   * the result that is passed to the socket.
   *
   * @example
   *
   * // Define a flow type for an email address.
   * const typeEmail = defineSocketType({
   *   kind: 'email',
   *   name: 'Email',
   *   color: '#3498db',
   *   description: 'A valid email address as per the RFC 5322 standard.',
   *   parser: (value) =>
   *     const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
   *     if (!isEmail) throw new Error('The value is not a valid email address.')
   *     return value
   *   },
   * })
   *
   * // Or use the built-in types.
   * import { string } from '@nwrx/module-core'
   */
  type: SocketType<T>

  /**
   * The display name of the socket. The name is used to identify the socket in the
   * editor and should be readable and descriptive.
   *
   * @example 'Email Address'
   */
  name?: string

  /**
   * The description of the socket. The description is used to provide additional
   * information about the socket and the result that is expected. It is shown as
   * a tooltip in the editor.
   *
   * @example 'The email address of the user.'
   */
  description?: string
}

/**
 * A schema that describes the result of a flow node. It contains a mapping of
 * the result ports that are available on the node. The result ports are used
 * to define the result that is returned by the node when it is processed.
 */
export type ResultSchema = Record<string, ResultSocket>

/**
 * Defines a socket that can be used to connect to another node in the flow.
 * The socket contains a type that is used to validate the result that is passed
 * to the socket and to provide information about the type of the result that is
 *
 * @param socket The socket that is used to connect to another node in the flow.
 * @returns The socket that is used to connect to another node in the flow.
 * @example
 * const socket = defineResultSocket({
 *   type: string,
 *   name: 'Name',
 *   description: 'The name of the user.',
 * })
 */
export function defineResultSocket<T = unknown>(socket: ResultSocket<T>): ResultSocket<T> {
  return socket
}
