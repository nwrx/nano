import type { Function, ObjectLike } from '@unshared/types'
import type { ProcessContext } from '../utils/defineComponent'
import ivm from 'isolated-vm'
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
export async function processInSandbox(fn: Function, context: ProcessContext): Promise<ObjectLike> {
  const fnWrapped = await wrapInSandbox(fn, { timeout: 10000 })

  // --- Restore "some" WebAPI functions.
  await implementFetch(fnWrapped.isolate, fnWrapped.context)
  await implementHeaders(fnWrapped.isolate, fnWrapped.context)
  await implementTextDecoder(fnWrapped.isolate, fnWrapped.context)
  await implementTextEncoder(fnWrapped.isolate, fnWrapped.context)

  // --- Call the function in the sandbox.
  return await fnWrapped({
    data: context.data,
    trace: new ivm.Callback((data: ObjectLike) => context.trace(data)),
  }) as ObjectLike
}
