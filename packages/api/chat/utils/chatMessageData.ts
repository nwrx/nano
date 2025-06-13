import { assert, createRuleSet, createParser } from '@unshared/validation'

export const CHAT_MESSAGE_DATA_SCHEMA = createRuleSet(

  /***************************************************************************/
  /* Input                                                                   */
  /***************************************************************************/

  [createParser({
    role: assert.stringEquals('user'),
    name: [[assert.undefined], [assert.stringNotEmpty]],
    content: assert.stringNotEmpty,
  })],

  [createParser({
    role: assert.stringEquals('assistant'),
    name: assert.stringNotEmpty,
    content: assert.stringNotEmpty,
  })],

  [createParser({
    role: assert.stringEquals('toolCallRequest'),
    id: assert.stringUuid,
    name: assert.stringNotEmpty,
    content: assert.objectStrict,
  })],

  [createParser({
    role: assert.stringEquals('toolCallResponse'),
    id: assert.stringUuid,
    name: assert.stringNotEmpty,
    content: assert.objectStrict,
  })],

  /***************************************************************************/
  /* Questions                                                               */
  /***************************************************************************/

  [createParser({
    role: assert.stringEquals('question'),
    content: assert.stringNotEmpty,
  })],

  [createParser({
    role: assert.stringEquals('question'),
    type: assert.stringEquals('select'),
    multiple: assert.boolean,
    content: assert.stringNotEmpty,
    options: createParser({
      id: assert.stringUuid,
      label: assert.stringNotEmpty,
    }),
  })],

  [createParser({
    role: assert.stringEquals('question'),
    type: assert.stringEquals('confirm'),
    content: assert.stringNotEmpty,
  })],
)

/** The message included in a chat thread. */
export type ChatMessageData = ReturnType<typeof CHAT_MESSAGE_DATA_SCHEMA>
