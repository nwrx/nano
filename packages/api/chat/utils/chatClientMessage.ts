import { assert, createArrayParser, createRuleSet, createSchema } from '@unshared/validation'

export const CHAT_CLIENT_MESSAGE_SCHEMA = createRuleSet(

  /***************************************************************************/
  /* Lifecycle                                                               */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('createThread'),
    project: assert.stringNotEmpty.with('You must provide a project name.'),
    name: assert.stringNotEmpty.with('You must provide a flow name.'),
  })],

  [createSchema({
    event: assert.stringEquals('openThread'),
    id: assert.stringUuid.with('You must provide a thread ID.'),
  })],

  /***************************************************************************/
  /* Input                                                                   */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('message'),
    message: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('answer'),
    answer: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('answerConfirm'),
    confirm: assert.boolean,
  })],

  [createSchema({
    event: assert.stringEquals('answerMultiple'),
    answers: createArrayParser(assert.stringNotEmpty),
  })],

  [createSchema({
    event: assert.stringEquals('answerSelect'),
    answer: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('attachment'),
    name: assert.stringNotEmpty,
    data: assert.stringNotEmpty,
  })],
)

/** The message received from the client in a flow thread. */
export type ChatClientMessage = ReturnType<typeof CHAT_CLIENT_MESSAGE_SCHEMA>
