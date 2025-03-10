import type { ThreadWorkerMessage } from './createThreadWorker'
import { assertObjectStrict, createRuleSet } from '@unshared/validation'

export const THREAD_SERVER_MESSAGE_SCHEMA = createRuleSet(
  [assertObjectStrict<ThreadWorkerMessage>],
)

/** The message sent from the server to the client in a flow editor session. */
export type ThreadServerMessage = ReturnType<typeof THREAD_SERVER_MESSAGE_SCHEMA>
