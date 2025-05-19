import type { SchemaOption } from '@nwrx/nano/utils'
import type { EditorState, FlowNodeObject } from './serializeSession'
import { assert, assertObjectStrict, createArrayParser, createRuleSet, createSchema } from '@unshared/validation'

export const EDITOR_SESSION_SERVER_MESSAGE_SCHEMA = createRuleSet(

  [createSchema({
    event: assert.stringEquals('syncronize'),
    data: assertObjectStrict as () => EditorState,
  })],
  [createSchema({
    event: assert.stringEquals('metadataChanged'),
    data: createArrayParser({
      name: assert.stringEnum('name', 'title', 'description'),
      value: assert.notNull,
    }),
  })],
  [createSchema({
    event: assert.stringEquals('error'),
    message: assert.stringNotEmpty,
  })],
  [createSchema({
    event: assert.stringEquals('getFlowExportResult'),
    data: createArrayParser(assert.stringNotEmpty),
  })],

  /***************************************************************************/
  /* Nodes                                                                   */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('nodesCreated'),
    data: createArrayParser(assertObjectStrict as () => FlowNodeObject),
  })],
  [createSchema({
    event: assert.stringEquals('nodesRemoved'),
    data: createArrayParser(assert.stringNotEmpty),
  })],
  [createSchema({
    event: assert.stringEquals('nodesMetadataChanged'),
    data: createArrayParser({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      value: assert.notNull,
    }),
  })],
  [createSchema({
    event: assert.stringEquals('nodesInputChanged'),
    data: createArrayParser({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      value: assert.notNull,
    }),
  })],
  [createSchema({
    event: assert.stringEquals('searchOptionsResult'),
    data: createArrayParser({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      options: assert.array as (value: unknown) => asserts value is SchemaOption[],
    }),
  })],

  /***************************************************************************/
  /* User                                                                    */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('userJoined'),
    data: createArrayParser({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      color: assert.stringNotEmpty,
    }),
  })],
  [createSchema({
    event: assert.stringEquals('userLeft'),
    data: createArrayParser(assert.stringNotEmpty),
  })],
  [createSchema({
    event: assert.stringEquals('usersPositionChanged'),
    data: createArrayParser({
      id: assert.stringNotEmpty,
      x: assert.number,
      y: assert.number,
    }),
  })],

)

/** The message sent from the server to the client in a flow editor session. */
export type EditorSessionServerMessage = ReturnType<typeof EDITOR_SESSION_SERVER_MESSAGE_SCHEMA>
export type EditorSessionServerMessageEvent = EditorSessionServerMessage['event']
