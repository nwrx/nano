import type { ModuleRunner } from '../application'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'
import { sendStream, setResponseHeader } from 'h3'
import { authorize } from '../utils'
import { deserialize } from '../worker'

export function threadGetOuputValue(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'GET /thread/:id/:name',
      parseParameters: createSchema({
        id: assertStringUuid,
        name: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      authorize.call(this, event)
      const { id, name } = parameters
      const thread = this.runnerSessions.get(id)
      if (!thread) throw new Error('Thread not found')

      // --- Get the output value from the thread session.
      const serialized = await thread.getOutputValue(name)
      const deserialized = deserialize(serialized) as ReadableStream<Uint8Array>

      if (deserialized instanceof ReadableStream) {
        setResponseHeader(event, 'Content-Type', 'application/octet-stream')
        await sendStream(event, deserialized)
      }
    },
  )
}
