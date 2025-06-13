import { assert, createRuleSet, createParser } from '@unshared/validation'
import { CHAT_MESSAGE_DATA_SCHEMA } from './chatMessageData'

export const CHAT_SERVER_MESSAGE_SCHEMA = createRuleSet(
  [createParser({
    event: assert.stringEquals('threadOpened'),
    id: assert.stringUuid,
    title: assert.stringNotEmpty,
    description: assert.stringNotEmpty,
    messages: assert.arrayOf({
      id: assert.stringUuid,
      createdAt: assert.stringNotEmpty,
      data: CHAT_MESSAGE_DATA_SCHEMA,
    }),
  })],

  [createParser({
    event: assert.stringEquals('message'),
    id: assert.stringUuid,
    createdAt: assert.stringNotEmpty,
    data: CHAT_MESSAGE_DATA_SCHEMA,
  })],

  [createParser({
    event: assert.stringEquals('error'),
    message: assert.stringNotEmpty,
    stack: [[assert.undefined], [assert.stringNotEmpty]],
  })],

  [createParser({
    event: assert.stringEquals('abort'),
  })],
)

/** The message sent to the client in a flow thread. */
export type ChatServerMessage = ReturnType<typeof CHAT_SERVER_MESSAGE_SCHEMA>
