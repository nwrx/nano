import { assert, createParser, createRuleSet } from '@unshared/validation'

export const CHAT_CLIENT_MESSAGE_SCHEMA = createRuleSet(

  /***************************************************************************/
  /* Lifecycle                                                               */
  /***************************************************************************/

  [createParser({
    event: assert.stringEquals('createThread'),
    project: assert.stringNotEmpty.withMessage('You must provide a project name.'),
    name: assert.stringNotEmpty.withMessage('You must provide a flow name.'),
  })],

  [createParser({
    event: assert.stringEquals('openThread'),
    id: assert.stringUuid.withMessage('You must provide a thread ID.'),
  })],

  /***************************************************************************/
  /* Input                                                                   */
  /***************************************************************************/

  [createParser({
    event: assert.stringEquals('message'),
    message: assert.stringNotEmpty,
  })],

  [createParser({
    event: assert.stringEquals('answer'),
    answer: assert.stringNotEmpty,
  })],

  [createParser({
    event: assert.stringEquals('answerConfirm'),
    confirm: assert.boolean,
  })],

  [createParser({
    event: assert.stringEquals('answerMultiple'),
    answers: assert.arrayOf(assert.stringNotEmpty),
  })],

  [createParser({
    event: assert.stringEquals('answerSelect'),
    answer: assert.stringNotEmpty,
  })],

  [createParser({
    event: assert.stringEquals('attachment'),
    name: assert.stringNotEmpty,
    data: assert.stringNotEmpty,
  })],
)

/** The message received from the client in a flow thread. */
export type ChatClientMessage = ReturnType<typeof CHAT_CLIENT_MESSAGE_SCHEMA>
