import type { ObjectLike } from '@unshared/types'
import { getNodeComponent, type Thread } from '../thread'
import { ERRORS as E } from '../utils'
import { implementFetch } from './implementFetch'
import { implementHeaders } from './implementHeaders'
import { implementTextDecoder } from './implementTextDecoder'
import { implementTextEncoder } from './implementTextEncoder'
import { wrapInSandbox } from './wrapInSandbox'

/**
 * Process the given function in a sandbox.
 *
 * @param thread The thread to process the function in.
 * @param nodeId The ID of the node to process the function for.
 * @param data The data to pass to the function.
 * @returns The result of the function call.
 */
export async function processInSandbox(thread: Thread, nodeId: string, data: ObjectLike = {}): Promise<ObjectLike> {
  const component = await getNodeComponent(thread, nodeId)
  if (!component.process) throw new Error('The component does not have a process function.')
  const fnWrapped = await wrapInSandbox(component.process, { timeout: 10000 })

  // --- Implement some WebAPI functionalities in the sandbox.
  await implementFetch(fnWrapped.isolate, fnWrapped.context)
  await implementHeaders(fnWrapped.isolate, fnWrapped.context)
  await implementTextDecoder(fnWrapped.isolate, fnWrapped.context)
  await implementTextEncoder(fnWrapped.isolate, fnWrapped.context)

  // --- Watch for the abort signal and dispose the context if it's aborted.
  return new Promise((resolve, reject) => {
    thread.abortController.signal.addEventListener('abort', () => {
      fnWrapped.context.release()
      fnWrapped.isolate.dispose()
      const error = E.ISOLATED_VM_DISPOSED()
      reject(error)
    })

    // --- Call the function in the sandbox.
    void fnWrapped({ data })
      .then(resolve)
      .catch(reject)
  })
}
