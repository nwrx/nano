import { assert, createArrayParser, createRuleSet, createSchema } from '@unshared/validation'
import { CHAT_MESSAGE_DATA_SCHEMA } from './chatMessageData'

export const CHAT_SERVER_MESSAGE_SCHEMA = createRuleSet(
  [createSchema({
    event: assert.stringEquals('threadOpened'),
    id: assert.stringUuid,
    title: assert.stringNotEmpty,
    summary: assert.stringNotEmpty,
    messages: createArrayParser({
      id: assert.stringUuid,
      createdAt: assert.stringNotEmpty,
      data: CHAT_MESSAGE_DATA_SCHEMA,
    }),
  })],

  [createSchema({
    event: assert.stringEquals('message'),
    id: assert.stringUuid,
    createdAt: assert.stringNotEmpty,
    data: CHAT_MESSAGE_DATA_SCHEMA,
  })],

  [createSchema({
    event: assert.stringEquals('error'),
    message: assert.stringNotEmpty,
    stack: [[assert.undefined], [assert.stringNotEmpty]],
  })],

  [createSchema({
    event: assert.stringEquals('abort'),
  })],
)

/** The message sent to the client in a flow thread. */
export type ChatServerMessage = ReturnType<typeof CHAT_SERVER_MESSAGE_SCHEMA>
