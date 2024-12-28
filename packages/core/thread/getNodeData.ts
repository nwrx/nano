import type { ObjectLike } from '@unshared/types'
import type { Thread } from './createThread'
import { ERRORS, resolveSchema } from '../utils'
import { getNode } from './getNode'
import { getNodeComponent } from './getNodeComponent'

export interface GetNodeDataOptions {
  skipErrors?: boolean
}

/**
 * Resolve the input object by iterating over the input schema and resolving the
 * input values. If the value is an array, each value in the array is resolved.
 *
 * @param thread The thread to resolve the input object.
 * @param id The ID of the node to resolve the input object.
 * @param options The options to resolve the input object.
 * @returns The resolved input object.
 * @example
 *
 * // Add a node that uses a reference to another node.
 * const id1 = addNode(thread, 'input')
 * const id2 = addNode(thread, 'output', { input: { name: createReference('Nodes', id1, 'value') } })
 *
 * // Start the thread and resolve the input object.
 * await getNodeData(thread, id2) // => { name: 'John Doe' }
 */
export async function getNodeData(thread: Thread, id: string, options: GetNodeDataOptions = {}) {
  const { skipErrors = false } = options
  const data: ObjectLike = {}
  const errors: Record<string, Error> = {}
  const node = getNode(thread, id)
  const component = await getNodeComponent(thread, id)

  // --- Iterate over the input schema and resolve the input values
  // --- one by one by calling the resolveSchema function for each input.
  for (const name in component.inputs) {
    try {
      data[name] = await resolveSchema(
        name,
        node.input[name],
        component.inputs[name],
        thread.referenceResolvers,
      )
    }
    catch (error) {
      errors[name] = error as Error
      if (skipErrors) continue
    }
  }

  // --- If `skipErrors` is false and there are errors, throws an error
  // --- that will list all the errors that occurred during the input resolution
  // --- and their respective names / paths.
  if (!skipErrors && Object.keys(errors).length > 0)
    throw ERRORS.NODE_INPUT_SCHEMA_MISMATCH(id, errors)

  // --- Return the resolved input so far.
  return data
}
