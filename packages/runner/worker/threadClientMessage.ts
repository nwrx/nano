import type { ThreadInputObject } from '@nwrx/nano'
import { assert, assertObjectStrict, createArrayParser, createRuleSet, createSchema } from '@unshared/validation'

export const THREAD_CLIENT_MESSAGE_SCHEMA = createRuleSet(

  [createSchema({
    event: assert.stringEquals('start'),
    data: assertObjectStrict<ThreadInputObject>,
  })],

  [createSchema({
    event: assert.stringEquals('abort'),
  })],

  [createSchema({
    event: assert.stringEquals('worker:resolveReferenceResult'),
    data: createArrayParser({
      id: assert.stringUuid,
      value: (x: unknown) => x,
    }),
  })],
)

/** The message received from the client in a flow session. */
export type ThreadClientMessage = ReturnType<typeof THREAD_CLIENT_MESSAGE_SCHEMA>
