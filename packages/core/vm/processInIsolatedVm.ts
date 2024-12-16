/* eslint-disable sonarjs/pseudo-random */
import type { ObjectLike } from '@unshared/types'
import type { Thread } from '../thread/createThread'
import type { Component, ProcessContext } from '../utils/defineComponent'
import ivm from 'isolated-vm'
import { ERRORS as E } from '../utils'
import { createWrapperCode } from './createWrapperCode'

export async function processInIsolatedVm(thread: Thread, component: Component, context: ProcessContext) {
  const isolate = new ivm.Isolate({
    memoryLimit: 8,
    inspector: true,
    onCatastrophicError(message) { throw E.RUNTIME_VM_CATASTROPHIC_FAILURE(message) },
  })
  const isolateContext = await isolate.createContext()
  const jail = isolateContext.global
  await jail.set('global', jail.derefInto())

  // --- Register the process wrapper.
  const wrapperCode = createWrapperCode(component.process!)
  const wrapperScript = await isolate.compileScript(wrapperCode)
  await wrapperScript.run(isolateContext)

  // --- Get the wrapper function from the jail.
  const process = await jail.get('__process', { reference: true })
  const registerStream = await jail.get('__registerStream', { reference: true })
  const pushStreamChunk = await jail.get('__pushStreamChunk', { reference: true })

  // --- Find all `ReadableStream` instances in the data and wrap them.
  const data: ObjectLike = {}
  const streams = new Map<string, ReadableStream>()
  for (const key in context.data) {
    const value = context.data[key]
    if (value instanceof ReadableStream) {
      const id = Math.random().toString(36).slice(2)
      await registerStream.apply(undefined, [id], { arguments: { copy: true } })
      streams.set(id, value)
      data[key] = { _streamId: id }
    }
    else {
      data[key] = value
    }
  }

  // --- For each streams, start piping the chunks to the wrapper.
  void Promise.all([...streams.entries()].map(async([id, stream]) => {
    const reader = stream.getReader()
    while (true) {
      const { done, value } = await reader.read() as { done: boolean; value: Uint8Array }
      await pushStreamChunk.apply(undefined, [id, value, done], { arguments: { copy: true } })
      if (done) break
    }
  }))

  // --- Call the process function of the component in the VM.
  return await process.apply(
    undefined,
    [{
      data,
      trace: new ivm.Reference(context.trace),
    }],
    {
      arguments: { copy: true },
      result: { promise: true, copy: true },
      timeout: 10000,
    },
  )
}
