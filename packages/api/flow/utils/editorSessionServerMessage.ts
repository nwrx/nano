import type { NodeState } from '@nwrx/nano'
import type { ComponentInstanceJSON } from './serializeComponentInstance'
import type { EditorSessionJSON } from './serializeSession'
import { assert, assertObjectStrict, createArrayParser, createRuleSet, createSchema } from '@unshared/validation'

export const EDITOR_SESSION_SERVER_MESSAGE_SCHEMA = createRuleSet(

  [createSchema({
    event: assert.stringEquals('init'),
    data: assertObjectStrict as () => EditorSessionJSON,
  })],

  [createSchema({
    event: assert.stringEquals('meta'),
    key: assert.stringNotEmpty,
    value: assert.notNull,
  })],

  [createSchema({
    event: assert.stringEquals('error'),
    message: assert.stringNotEmpty,
  })],

  /***************************************************************************/
  /* User                                                                    */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('user:join'),
    id: assert.stringNotEmpty,
    name: assert.stringNotEmpty,
    color: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('user:leave'),
    id: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('user:position'),
    id: assert.stringNotEmpty,
    x: assert.number,
    y: assert.number,
  })],

  /***************************************************************************/
  /* Flow thread                                                             */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('thread:start'),
    input: assert.object,
  })],

  [createSchema({
    event: assert.stringEquals('thread:abort'),
  })],

  [createSchema({
    event: assert.stringEquals('thread:error'),
    code: assert.string,
    message: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('thread:end'),
    output: assert.object,
  })],

  [createSchema({
    event: assert.stringEquals('thread:input'),
    name: assert.stringNotEmpty,
    value: assert.notNull,
  })],

  [createSchema({
    event: assert.stringEquals('thread:output'),
    name: assert.stringNotEmpty,
    value: assert.notNull,
  })],

  [createSchema({
    event: assert.stringEquals('thread:nodeState'),
    id: assert.stringNotEmpty,
    state: assert.stringNotEmpty as (value: unknown) => asserts value is NodeState,
  })],

  [createSchema({
    event: assert.stringEquals('thread:nodeStart'),
    id: assert.stringNotEmpty,
    data: assert.object,
  })],

  [createSchema({
    event: assert.stringEquals('thread:nodeTrace'),
    id: assert.stringNotEmpty,
    data: assert.object,
  })],

  [createSchema({
    event: assert.stringEquals('thread:nodeError'),
    id: assert.stringNotEmpty,
    name: assert.string,
    message: assert.stringNotEmpty,
    context: assert.object,
  })],

  [createSchema({
    event: assert.stringEquals('thread:nodeEnd'),
    id: assert.stringNotEmpty,
    data: assert.object,
    result: assert.object,
  })],

  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('variables:create'),
    name: assert.stringNotEmpty,
    value: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('variables:update'),
    name: assert.stringNotEmpty,
    value: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('variables:remove'),
    name: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('secrets:create'),
    name: assert.stringNotEmpty,
    value: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('secrets:update'),
    name: assert.stringNotEmpty,
    value: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('secrets:remove'),
    name: assert.stringNotEmpty,
  })],

  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('node:created'),
    id: assert.stringNotEmpty,
    x: assert.number,
    y: assert.number,
    component: assertObjectStrict as () => ComponentInstanceJSON,
  })],

  [createSchema({
    event: assert.stringEquals('node:removed'),
    ids: createArrayParser(assert.stringNotEmpty),
  })],

  [createSchema({
    event: assert.stringEquals('node:metaValueChanged'),
    id: assert.stringNotEmpty,
    name: assert.stringNotEmpty,
    value: assert.notNull,
  })],

  [createSchema({
    event: assert.stringEquals('node:inputValueChanged'),
    id: assert.stringNotEmpty,
    name: assert.stringNotEmpty,
    value: assert.notNull,
  })],

  [createSchema({
    event: assert.stringEquals('node:inputOptionResult'),
    id: assert.stringNotEmpty,
    name: assert.stringNotEmpty,
    options: createArrayParser(assert.object),
  })],
)

/** The message sent from the server to the client in a flow editor session. */
export type EditorSessionServerMessage = ReturnType<typeof EDITOR_SESSION_SERVER_MESSAGE_SCHEMA>
