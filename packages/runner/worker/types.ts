import type { FlowV1 } from '@nwrx/nano'
import type { ReferenceType } from '@nwrx/nano/utils'
import type { UUID } from 'node:crypto'
import type { SerializedError } from './deserializeError'
import { type ThreadEventMap, type ThreadInputObject } from '@nwrx/nano'
import { assert, createParser, createRuleSet } from '@unshared/validation'

const CLIENT_MESSAGE_WORKER_LOAD = createParser({
  event: assert.stringEquals('worker.load'),
  data: assert.objectStrict as (v: unknown) => asserts v is FlowV1,
})

const CLIENT_MESSAGE_WORKER_START = createParser({
  event: assert.stringEquals('worker.start'),
  data: assert.objectStrict<ThreadInputObject>,
})

const CLIENT_MESSAGE_WORKER_ABORT = createParser({
  event: assert.stringEquals('worker.abort'),
})

const CLIENT_MESSAGE_WORKER_REFERENCE_RESULT = createParser({
  event: assert.stringEquals('worker.references.result'),
  data: {
    id: assert.stringUuid,
    value: (x: unknown) => x,
  },
})

export const CLIENT_MESSAGE_SCHEMA = createRuleSet(
  [CLIENT_MESSAGE_WORKER_LOAD],
  [CLIENT_MESSAGE_WORKER_START],
  [CLIENT_MESSAGE_WORKER_ABORT],
  [CLIENT_MESSAGE_WORKER_REFERENCE_RESULT],
)

export const SERVER_MESSAGE_SCHEMA = createRuleSet(
  [assert.objectStrict<ThreadWorkerMessage>],
)

/** Message originating from the client. */
export type ThreadClientMessage = ReturnType<typeof CLIENT_MESSAGE_SCHEMA>

/** Message originating from the server. */
export type ThreadServerMessage = ReturnType<typeof SERVER_MESSAGE_SCHEMA>

/** Message that will be sent from te worker to the main thread. */
export type ThreadWorkerMessage =
  | { [K in keyof ThreadEventMap]: { event: K; data: ThreadEventMap[K] } }[keyof ThreadEventMap]
  | { event: 'worker.error'; data: SerializedError }
  | { event: 'worker.loaded' }
  | { event: 'worker.ready' }
  | { event: 'worker.references.resolve'; data: readonly [id: UUID, type: ReferenceType, values: string[]] }
