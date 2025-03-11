import type { ModuleRunner } from '../application'
import type { ThreadClientMessage, ThreadWorkerMessage } from '../worker'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'
import { sendStream, setResponseHeader } from 'h3'
import { authorize } from '../utils'
import { deserialize } from '../worker'

export function threadGetOuputValue(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'GET /threads/:thread/:output',
      parseParameters: createSchema({
        thread: assertStringUuid,
        output: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      authorize.call(this, event)
      const worker = this.runnerWorkerPorts.get(parameters.thread)
      if (!worker) throw this.errors.THREAD_NOT_FOUND(parameters.thread)

      // --- Send a message to the worker to get the output value.
      const serialized = await new Promise<unknown>((resolve, reject) => {
        worker.postMessage({ event: 'getOutputValue', name: parameters.output } as ThreadClientMessage)
        const callback = (message: ThreadWorkerMessage) => {
          if (message.event === 'worker:outputValue') {
            const [outputName, value] = message.data
            if (outputName !== parameters.output) return
            worker.off('message', callback)
            resolve(value)
          }
        }
        worker.once('error', reject)
        worker.on('message', callback)
      })

      // --- Deserialize the value and send it back to the client.
      const deserialized = deserialize(serialized) as ReadableStream<Uint8Array>
      if (deserialized instanceof ReadableStream) {
        setResponseHeader(event, 'Content-Type', 'application/octet-stream')
        await sendStream(event, deserialized)
      }
    },
  )
}
