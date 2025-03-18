/* eslint-disable sonarjs/todo-tag */
import type { Thread } from './createThread'
import { type Schema, serializeSpecifier } from '../utils'

export interface GetInputSchemaOptions {
  inputSpecifiers?: string[]
}

/**
 * Collect all `input` nodes from the thread and return the schema that is used
 * to collect the input from the user. The schema is used to collect the input
 * from the user and validate the input before running the flow.
 *
 * @param thread The thread to collect the input schema from.
 * @param options The options to customize the input schema.
 * @returns The input schema that is used to collect the input from the user.
 * @example getInputSchema(thread) // => { message: { type: 'string' } }
 */
export function getInputSchema(thread: Thread, options: GetInputSchemaOptions = {}): Record<string, Schema> {
  const { inputSpecifiers = ['input'] } = options
  const schema: Record<string, Schema> = {}
  for (const [id, node] of thread.nodes) {
    const specifier = serializeSpecifier(node)
    const match = inputSpecifiers.some(inputSpecifier => specifier.includes(inputSpecifier))
    if (!match) continue
    // TODO: Handle dynamic type when it is implemented.
    schema[id] = { type: 'string' }
  }
  return schema
}
