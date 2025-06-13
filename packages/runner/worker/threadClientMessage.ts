import type { ThreadInputObject } from '@nwrx/nano'
import { assert, assertObjectStrict, createArrayParser, createRuleSet, createSchema } from '@unshared/validation'

export const THREAD_CLIENT_MESSAGE_SCHEMA = createRuleSet(

  [createSchema({
    event: assert.stringEquals('workerStart'),
    data: createArrayParser(assertObjectStrict<ThreadInputObject>),
  })],

  [createSchema({
    event: assert.stringEquals('workerAbort'),
  })],

  [createSchema({
    event: assert.stringEquals('workerGetOutputSchema'),
  })],

  [createSchema({
    event: assert.stringEquals('workerGetInputSchema'),
  })],

  [createSchema({
    event: assert.stringEquals('workerResolveComponents'),
    data: createArrayParser({ id: assert.stringNotEmpty }),
  })],

  [createSchema({
    event: assert.stringEquals('workerResolveReferenceResult'),
    data: createArrayParser({
      id: assert.stringUuid,
      value: (x: unknown) => x,
    }),
  })],
)

/** The message received from the client in a flow session. */
export type ThreadClientMessage = ReturnType<typeof THREAD_CLIENT_MESSAGE_SCHEMA>
