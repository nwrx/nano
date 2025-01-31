import { assert, createArrayParser, createRuleSet, createSchema } from '@unshared/validation'

export const FLOW_SESSION_MESSAGE_SCHEMA = createRuleSet(

  // --- User events.
  [createSchema({
    event: assert.stringEquals('userJoin'),
    token: assert.stringNotEmpty,
  })],
  [createSchema({
    event: assert.stringEquals('userLeave'),
  })],
  [createSchema({
    event: assert.stringEquals('userSetPosition'),
    x: assert.number,
    y: assert.number,
  })],

  // --- Flow events.
  [createSchema({
    event: assert.stringEquals('flowSetMetaValue'),
    key: assert.stringNotEmpty,
    value: assert.notNull,
  })],
  [createSchema({
    event: assert.stringEquals('flowStart'),
    input: assert.object,
  })],
  [createSchema({
    event: assert.stringEquals('flowAbort'),
  })],

  // --- Flow variable events.
  [createSchema({
    event: assert.stringEquals('flowVariableCreate'),
    name: [assert.stringNotEmpty, assert.stringConstantCase],
    value: assert.stringNotEmpty,
  })],
  [createSchema({
    event: assert.stringEquals('flowVariableUpdate'),
    name: [assert.stringNotEmpty, assert.stringConstantCase],
    value: assert.stringNotEmpty,
  })],
  [createSchema({
    event: assert.stringEquals('flowVariableRemove'),
    name: [assert.stringNotEmpty, assert.stringConstantCase],
  })],

  // --- Flow secret events.
  [createSchema({
    event: assert.stringEquals('flowSecretCreate'),
    name: [assert.stringNotEmpty, assert.stringConstantCase],
    value: assert.stringNotEmpty,
  })],
  [createSchema({
    event: assert.stringEquals('flowSecretUpdate'),
    name: [assert.stringNotEmpty, assert.stringConstantCase],
    value: assert.stringNotEmpty,
  })],
  [createSchema({
    event: assert.stringEquals('flowSecretRemove'),
    name: [assert.stringNotEmpty, assert.stringConstantCase],
  })],

  // --- Node events.
  [createSchema({
    event: assert.stringEquals('nodeCreate'),
    kind: assert.stringNotEmpty,
    x: assert.number,
    y: assert.number,
  })],
  [createSchema({
    event: assert.stringEquals('nodeDuplicate'),
    nodeId: assert.stringNotEmpty,
    x: assert.number,
    y: assert.number,
  })],
  [createSchema({
    event: assert.stringEquals('nodeStart'),
    nodeId: assert.stringNotEmpty,
  })],
  [createSchema({
    event: assert.stringEquals('nodeAbort'),
    nodeId: assert.stringNotEmpty,
  })],
  [createSchema({
    event: assert.stringEquals('nodeSetMetaValue'),
    nodes: createArrayParser({
      nodeId: assert.stringNotEmpty,
      key: assert.stringNotEmpty,
      value: assert.notNull,
    }),
  })],
  [createSchema({
    event: assert.stringEquals('nodeSetDataValue'),
    nodeId: assert.stringNotEmpty,
    portId: assert.stringNotEmpty,
    value: assert.notNull,
  })],
  [createSchema({
    event: assert.stringEquals('nodeSearchDataOptions'),
    id: assert.stringNotEmpty,
    key: assert.stringNotEmpty,
    query: assert.stringNotEmpty,
  })],
  [createSchema({
    event: assert.stringEquals('nodesRemove'),
    nodeIds: createArrayParser(assert.stringNotEmpty),
  })],

  // --- Link events.
  [createSchema({
    event: assert.stringEquals('linkCreate'),
    source: assert.stringNotEmpty,
    target: assert.stringNotEmpty,
  })],
  [createSchema({
    event: assert.stringEquals('linkRemove'),
    source: assert.stringNotEmpty,
  })],
)

/** The message received from the client in a flow session. */
export type FlowSessionMessage = ReturnType<typeof FLOW_SESSION_MESSAGE_SCHEMA>
