import type { FlowV1 } from '@nwrx/nano'
import type { ModuleRunner } from '../application'
import { createHttpRoute } from '@unserved/server'
import { assertObjectStrict, assertStringUuid, createParser } from '@unshared/validation'
import { authorize } from '../utils'
import { createThreadWorker } from '../worker'

export function threadCreate(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'POST /threads/:id',
      parseParameters: createParser({
        id: assertStringUuid,
      }),
      parseBody: createParser({
        flow: assertObjectStrict as (value: unknown) => FlowV1,
      }),
    },
    async({ event, parameters, body }) => {
      authorize.call(this, event)

      // --- If ID already exists, abort early.
      const exists = this.runnerWorkerPorts.has(parameters.id)
      if (exists) throw this.errors.THREAD_ALREADY_INSTANTIATED(parameters.id)

      // --- Otherwise, create a new thread worker for the given flow.
      const worker = await createThreadWorker.call(this, body.flow)
      this.runnerWorkerPorts.set(parameters.id, worker)
    },
  )
}
