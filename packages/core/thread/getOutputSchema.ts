/* eslint-disable sonarjs/todo-tag */
import type { Thread } from './createThread'
import { type Schema, serializeSpecifier } from '../utils'

export interface GetOutputSchemaOptions {
  outputSpecifiers?: string[]
}

/**
 * Collect all `output` nodes from the thread and return the schema that is used
 * to validate the output before returning the result to the user. The schema is
 * used to validate the output before returning the result to the user.
 *
 * @param thread The thread to collect the output schema from.
 * @param options The options to customize the output schema.
 * @returns The output schema that is used to validate the output before returning the result to the user.
 * @example getOutputSchema(thread) // => { message: { type: 'string' } }
 */
export function getOutputSchema(thread: Thread, options: GetOutputSchemaOptions = {}): Record<string, Schema> {
  const { outputSpecifiers = ['output'] } = options
  const schema: Record<string, Schema> = {}
  for (const [id, node] of thread.nodes) {
    const specifier = serializeSpecifier(node)
    const match = outputSpecifiers.some(outputSpecifier => specifier.includes(outputSpecifier))
    if (!match) continue
    // TODO: Handle dynamic type when it is implemented.
    schema[id] = { type: 'string' }
  }
  return schema
}
