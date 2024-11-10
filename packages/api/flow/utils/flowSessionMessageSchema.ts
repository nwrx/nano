import { assert, createArrayParser, createRuleSet, createSchema } from '@unshared/validation'

export const FLOW_SESSION_MESSAGE_SCHEMA = createRuleSet(

  /***************************************************************************/
  /* Execute                                                                 */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('start'),
    input: assert.object,
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
    key: assert.stringNotEmpty,
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
    event: assert.stringEquals('setNodeMetaValues'),
    nodes: createArrayParser({
      id: assert.stringNotEmpty,
      key: assert.stringNotEmpty,
      value: assert.notNull,
    }),
  })],

  [createSchema({
    event: assert.stringEquals('setNodeInputValue'),
    id: assert.stringNotEmpty,
    key: assert.stringNotEmpty,
    value: assert.notNull,
  })],

  [createSchema({
    event: assert.stringEquals('getInputValueOptions'),
    id: assert.stringNotEmpty,
    key: assert.stringNotEmpty,
    query: assert.string,
  })],

  /***************************************************************************/
  /* Links                                                                   */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('createLink'),
    source: assert.stringNotEmpty,
    target: assert.stringNotEmpty,
  })],

  [createSchema({
    event: assert.stringEquals('removeLink'),
    source: assert.stringNotEmpty,
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
export type FlowSessionMessage = ReturnType<typeof FLOW_SESSION_MESSAGE_SCHEMA>
