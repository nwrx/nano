import type { ObjectLike } from '@unshared/types'
import { assert, assertObjectStrict, createArrayParser, createRuleSet, createSchema } from '@unshared/validation'

export const EDITOR_SESSION_CLIENT_MESSAGE_SCHEMA = createRuleSet(

  /***************************************************************************/
  /* Execute                                                                 */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('start'),
    input: assertObjectStrict<ObjectLike>,
  })],

  [createSchema({
    event: assert.stringEquals('abort'),
  })],

  [createSchema({
    event: assert.stringEquals('startNode'),
    id: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('abortNode'),
    id: assert.stringNotEmpty,
  })],

  /***************************************************************************/
  /* Flow                                                                    */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('setMetaValue'),
    name: assert.stringNotEmpty,
    value: assert.notNull,
  })],

  /***************************************************************************/
  /* Secrets & Variables                                                     */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('createVariable'),
    name: [assert.stringNotEmpty, assert.stringConstantCase],
    value: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('updateVariable'),
    name: [assert.stringNotEmpty, assert.stringConstantCase],
    value: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('removeVariable'),
    name: [assert.stringNotEmpty, assert.stringConstantCase],
  })],

  [createSchema({
    event: assert.stringEquals('createSecret'),
    name: [assert.stringNotEmpty, assert.stringConstantCase],
    value: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('updateSecret'),
    name: [assert.stringNotEmpty, assert.stringConstantCase],
    value: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('removeSecret'),
    name: [assert.stringNotEmpty, assert.stringConstantCase],
  })],

  /***************************************************************************/
  /* Nodes                                                                   */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('createNode'),
    kind: assert.stringNotEmpty,
    x: assert.number,
    y: assert.number,
  })],

  [createSchema({
    event: assert.stringEquals('cloneNodes'),
    id: assert.stringNotEmpty,
    x: assert.number,
    y: assert.number,
  })],

  [createSchema({
    event: assert.stringEquals('removeNodes'),
    ids: createArrayParser(assert.stringNotEmpty),
  })],

  [createSchema({
    event: assert.stringEquals('setNodeLabel'),
    id: assert.stringNotEmpty,
    label: assert.string,
  })],

  [createSchema({
    event: assert.stringEquals('setNodeComment'),
    id: assert.stringNotEmpty,
    comment: assert.string,
  })],

  [createSchema({
    event: assert.stringEquals('setNodesPosition'),
    positions: createArrayParser({
      id: assert.stringNotEmpty,
      x: assert.number,
      y: assert.number,
    }),
  })],

  [createSchema({
    event: assert.stringEquals('setNodeInputValue'),
    id: assert.stringNotEmpty,
    name: assert.stringNotEmpty,
    value: assert.notNull,
  })],

  [createSchema({
    event: assert.stringEquals('setNodeInputVisibility'),
    id: assert.stringNotEmpty,
    name: assert.stringNotEmpty,
    visible: assert.boolean,
  })],

  [createSchema({
    event: assert.stringEquals('getInputValueOptions'),
    id: assert.stringNotEmpty,
    name: assert.stringNotEmpty,
    query: [[assert.undefined], [assert.string]],
  })],

  /***************************************************************************/
  /* Links                                                                   */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('createLink'),
    sourceId: assert.stringNotEmpty,
    sourceName: assert.stringNotEmpty,
    sourcePath: [[assert.undefined], [assert.stringNotEmpty]],
    targetId: assert.stringNotEmpty,
    targetName: assert.stringNotEmpty,
    targetPath: [[assert.undefined], [assert.stringNotEmpty]],
  })],

  [createSchema({
    event: assert.stringEquals('removeLink'),
    id: assert.stringNotEmpty,
    name: assert.stringNotEmpty,
    path: [[assert.undefined], [assert.stringNotEmpty]],
  })],

  /***************************************************************************/
  /* User                                                                    */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('setUserPosition'),
    x: assert.number,
    y: assert.number,
  })],

  [createSchema({
    event: assert.stringEquals('userLeave'),
  })],
)

/** The message received from the client in a flow session. */
export type EditorSessionClientMessage = ReturnType<typeof EDITOR_SESSION_CLIENT_MESSAGE_SCHEMA>
