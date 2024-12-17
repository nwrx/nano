import type { Function, MaybePromise } from '@unshared/types'
import type { IsolateOptions, RunOptions } from 'isolated-vm'
import type { DereferencedDeep } from './dererenceDeep'
import ivm from 'isolated-vm'
import { ERRORS as E } from '../utils'
import { dererenceDeep } from './dererenceDeep'

export type IsolateFunctionCall<T> =
  T extends (...parameters: infer P) => MaybePromise<infer R>
    ? R extends (...parameters: infer Q) => MaybePromise<infer S>
      ? (...parameters: P) => Promise<(...parameters: Q) => Promise<DereferencedDeep<S>>>
      : (...parameters: P) => Promise<DereferencedDeep<R>>
    : never

export type IsolateFunction<T> = IsolateFunctionCall<T> & {
  isolate: ivm.Isolate
  context: ivm.Context
}

export interface WrapInSandboxOptions extends RunOptions, IsolateOptions {}

export async function wrapInSandbox<T extends Function>(fn: string | T, options: WrapInSandboxOptions = {}): Promise<IsolateFunction<T>> {
  const {
    memoryLimit = 8,
    timeout = 10000,
    onCatastrophicError = (message) => { throw E.ISOLATED_VM_CATASTROPHIC_FAILURE(message) },
  } = options

  const isolate = new ivm.Isolate({ memoryLimit, onCatastrophicError })
  const context = await isolate.createContext()

  // --- Get the reference to the injected function.
  const call = async(...parameters: unknown[]): Promise<unknown> => {
    const argsString = Array.from({ length: parameters.length }, (_, i) => `$${i}`).join(', ')
    const ref = await context.evalClosure(`return (${fn.toString()})(${argsString})`, parameters, {
      arguments: { copy: true },
      result: { reference: true, promise: true },
      timeout,
      filename: 'sandbox.js',
    }) as unknown
    return dererenceDeep(ref)
  }

  // --- Return the isolate with the injected function.
  return new Proxy(call, {
    get(target, key) {
      if (key === 'isolate') return isolate
      if (key === 'context') return context
      if (key === 'apply') return call
    },
  }) as IsolateFunction<T>
}
