import type { ThreadWorkerMessage } from './createThreadWorker'
import { assert, createRuleSet } from '@unshared/validation'

export const THREAD_SERVER_MESSAGE_SCHEMA = createRuleSet(
  [assert.objectStrict as (value: unknown) => asserts value is ThreadWorkerMessage],
)

/** The message sent from the server to the client in a flow editor session. */
export type ThreadServerMessage = ReturnType<typeof THREAD_SERVER_MESSAGE_SCHEMA>
