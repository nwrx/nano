import type { Function, ObjectLike } from '@unshared/types'
import type { ConfirmOption } from '../utils'
import type { ProcessContext } from '../utils/defineComponent'
import ivm from 'isolated-vm'
import { ERRORS as E } from '../utils'
import { implementFetch } from './implementFetch'
import { implementHeaders } from './implementHeaders'
import { implementTextDecoder } from './implementTextDecoder'
import { implementTextEncoder } from './implementTextEncoder'
import { wrapInSandbox } from './wrapInSandbox'

/**
 * Process the given function in a sandbox.
 *
 * @param fn The function to wrap in a sandbox.
 * @param context The data and trace to pass to the function.
 * @returns The result of the function call.
 */
export async function processInSandbox(fn: Function | string, context: ProcessContext): Promise<ObjectLike> {
  const fnWrapped = await wrapInSandbox(fn, { timeout: 10000 })

  // --- Implement some WebAPI functions.
  await implementFetch(fnWrapped.isolate, fnWrapped.context)
  await implementHeaders(fnWrapped.isolate, fnWrapped.context)
  await implementTextDecoder(fnWrapped.isolate, fnWrapped.context)
  await implementTextEncoder(fnWrapped.isolate, fnWrapped.context)

  // --- Watch for the abort signal and dispose the context if it's aborted.
  return new Promise((resolve, reject) => {
    context.abortSignal?.addEventListener('abort', () => {
      fnWrapped.context.release()
      fnWrapped.isolate.dispose()
      const error = E.ISOLATED_VM_DISPOSED()
      reject(error)
    })

    // --- Call the function in the sandbox.
    void fnWrapped({
      data: context.data,
      askQuestion: new ivm.Callback((options: ConfirmOption) => context.askQuestion(options)),
      askConfirmation: new ivm.Callback((options: ConfirmOption) => context.askConfirmation(options)),
    })
      .then(resolve)
      .catch(reject)
  })
}
