import type { SchemaOption } from '@nwrx/nano/utils'
import type { EditorState, FlowNodeObject } from './serializeSession'
import { assert, assertObjectStrict, createParser, createRuleSet } from '@unshared/validation'

export const EDITOR_SESSION_SERVER_MESSAGE_SCHEMA = createRuleSet(

  [createParser({
    event: assert.stringEquals('syncronize'),
    data: assertObjectStrict as () => EditorState,
  })],
  [createParser({
    event: assert.stringEquals('metadataChanged'),
    data: assert.arrayOf({
      name: assert.stringEnum('name', 'title', 'description'),
      value: assert.notNull,
    }),
  })],
  [createParser({
    event: assert.stringEquals('error'),
    message: assert.stringNotEmpty,
  })],
  [createParser({
    event: assert.stringEquals('getFlowExportResult'),
    data: assert.arrayOf(assert.stringNotEmpty),
  })],

  /***************************************************************************/
  /* Nodes                                                                   */
  /***************************************************************************/

  [createParser({
    event: assert.stringEquals('nodesCreated'),
    data: assert.arrayOf(assertObjectStrict as () => FlowNodeObject),
  })],
  [createParser({
    event: assert.stringEquals('nodesRemoved'),
    data: assert.arrayOf(assert.stringNotEmpty),
  })],
  [createParser({
    event: assert.stringEquals('nodesMetadataChanged'),
    data: assert.arrayOf({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      value: assert.notNull,
    }),
  })],
  [createParser({
    event: assert.stringEquals('nodesInputChanged'),
    data: assert.arrayOf({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      value: assert.notNull,
    }),
  })],
  [createParser({
    event: assert.stringEquals('searchOptionsResult'),
    data: assert.arrayOf({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      options: assert.array as (value: unknown) => asserts value is SchemaOption[],
    }),
  })],

  /***************************************************************************/
  /* User                                                                    */
  /***************************************************************************/

  [createParser({
    event: assert.stringEquals('userJoined'),
    data: assert.arrayOf({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      color: assert.stringNotEmpty,
    }),
  })],
  [createParser({
    event: assert.stringEquals('userLeft'),
    data: assert.arrayOf(assert.stringNotEmpty),
  })],
  [createParser({
    event: assert.stringEquals('usersPositionChanged'),
    data: assert.arrayOf({
      id: assert.stringNotEmpty,
      x: assert.number,
      y: assert.number,
    }),
  })],

)

/** The message sent from the server to the client in a flow editor session. */
export type EditorSessionServerMessage = ReturnType<typeof EDITOR_SESSION_SERVER_MESSAGE_SCHEMA>
export type EditorSessionServerMessageEvent = EditorSessionServerMessage['event']
