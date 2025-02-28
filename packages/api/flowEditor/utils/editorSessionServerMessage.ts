import type { EditorNodeObject } from './serializeNode'
import type { EditorSessionObject } from './serializeSession'
import { assert, assertObjectStrict, createArrayParser, createRuleSet, createSchema } from '@unshared/validation'

export const EDITOR_SESSION_SERVER_MESSAGE_SCHEMA = createRuleSet(

  [createSchema({
    event: assert.stringEquals('init'),
    data: assertObjectStrict as () => EditorSessionObject,
  })],

  [createSchema({
    event: assert.stringEquals('meta'),
    name: assert.stringNotEmpty,
    value: assert.notNull,
  })],

  [createSchema({
    event: assert.stringEquals('error'),
    message: assert.stringNotEmpty,
  })],

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

  [createSchema({
    event: assert.stringEquals('node:created'),
    id: assert.stringNotEmpty,
    x: assert.number,
    y: assert.number,
    component: assertObjectStrict as () => EditorNodeObject,
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

  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('node:linkCreated'),
    data: createArrayParser({
      sourceId: assert.stringNotEmpty,
      sourceName: assert.stringNotEmpty,
      sourcePath: [[assert.undefined], [assert.stringNotEmpty]],
      targetId: assert.stringNotEmpty,
      targetName: assert.stringNotEmpty,
      targetPath: [[assert.undefined], [assert.stringNotEmpty]],
    }),
  })],

  [createSchema({
    event: assert.stringEquals('node:linkRemoved'),
    data: createArrayParser({
      id: [[assert.undefined], [assert.stringNotEmpty]],
      name: [[assert.undefined], [assert.stringNotEmpty]],
      // path: [[assert.undefined], [assert.stringNotEmpty]],
    }),
  })],
)

/** The message sent from the server to the client in a flow editor session. */
export type EditorSessionServerMessage = ReturnType<typeof EDITOR_SESSION_SERVER_MESSAGE_SCHEMA>
