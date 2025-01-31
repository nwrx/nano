import type { FlowV1, ThreadInputObject } from '@nwrx/core'
import { assert, assertObjectStrict, createRuleSet, createSchema } from '@unshared/validation'

export const THREAD_CLIENT_MESSAGE_SCHEMA = createRuleSet(

  [createSchema({
    event: assert.stringEquals('create'),
    data: assertObjectStrict<FlowV1>,
  })],

  [createSchema({
    event: assert.stringEquals('start'),
    data: assertObjectStrict<ThreadInputObject>,
  })],

  [createSchema({
    event: assert.stringEquals('abort'),
  })],

  [createSchema({
    event: assert.stringEquals('getOutputValue'),
    name: assert.stringNotEmpty,
  })],
)

/** The message received from the client in a flow session. */
export type ThreadClientMessage = ReturnType<typeof THREAD_CLIENT_MESSAGE_SCHEMA>
