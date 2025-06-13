import type { ThreadInputObject } from '@nwrx/nano'
import { assert, assertObjectStrict, createRuleSet, createParser } from '@unshared/validation'

export const THREAD_CLIENT_MESSAGE_SCHEMA = createRuleSet(

  [createParser({
    event: assert.stringEquals('workerStart'),
    data: assert.arrayOf(assertObjectStrict<ThreadInputObject>),
  })],

  [createParser({
    event: assert.stringEquals('workerAbort'),
  })],

  [createParser({
    event: assert.stringEquals('workerGetOutputSchema'),
  })],

  [createParser({
    event: assert.stringEquals('workerGetInputSchema'),
  })],

  [createParser({
    event: assert.stringEquals('workerResolveComponents'),
    data: assert.arrayOf({ id: assert.stringNotEmpty }),
  })],

  [createParser({
    event: assert.stringEquals('workerResolveReferenceResult'),
    data: assert.arrayOf({
      id: assert.stringUuid,
      value: (x: unknown) => x,
    }),
  })],
)

/** The message received from the client in a flow session. */
export type ThreadClientMessage = ReturnType<typeof THREAD_CLIENT_MESSAGE_SCHEMA>
