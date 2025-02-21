import type { FlowV1 } from '@nwrx/nano'
import type { ObjectLike } from '@unshared/types'
import type { ModuleRunner } from '../application'
import { createHttpRoute } from '@unserved/server'
import { assertObjectStrict, createParser } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { authorize } from '../utils'
import { createThreadWorker } from '../worker'

export function threadCreate(this: ModuleRunner) {
  return createHttpRoute(
    {
      name: 'POST /threads',
      parseBody: createParser(assertObjectStrict<FlowV1 & ObjectLike>),
    },
    async({ event, body }) => {
      authorize.call(this, event)

      // --- Create a new thread worker and store it in memory.
      const id = randomUUID()
      const thread = await createThreadWorker.call(this, body)
      this.runnerSessions.set(id, thread)

      // --- Return the thread session ID.
      return { id }
    },
  )
}
