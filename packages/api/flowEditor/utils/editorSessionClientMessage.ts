import { assert, createArrayParser, createRuleSet, createSchema } from '@unshared/validation'

export const EDITOR_SESSION_CLIENT_MESSAGE_SCHEMA = createRuleSet(

  /***************************************************************************/
  /* Flow                                                                    */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('setMetaValues'),
    data: createArrayParser({
      name: assert.stringNotEmpty,
      value: assert.notNull,
    }),
  })],

  /***************************************************************************/
  /* Nodes                                                                   */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('createNodes'),
    data: createArrayParser({
      specifier: assert.stringNotEmpty,
      x: assert.number,
      y: assert.number,
    }),
  })],

  [createSchema({
    event: assert.stringEquals('cloneNodes'),
    data: createArrayParser({
      id: assert.stringNotEmpty,
      x: assert.number,
      y: assert.number,
    }),
  })],

  [createSchema({
    event: assert.stringEquals('removeNodes'),
    data: createArrayParser(assert.stringNotEmpty),
  })],

  [createSchema({
    event: assert.stringEquals('setNodesLabel'),
    data: createArrayParser({
      id: assert.stringNotEmpty,
      label: assert.string,
    }),
  })],

  [createSchema({
    event: assert.stringEquals('setNodesComment'),
    data: createArrayParser({
      id: assert.stringNotEmpty,
      comment: assert.string,
    }),
  })],

  [createSchema({
    event: assert.stringEquals('setNodesPosition'),
    data: createArrayParser({
      id: assert.stringNotEmpty,
      x: assert.number,
      y: assert.number,
    }),
  })],

  [createSchema({
    event: assert.stringEquals('setNodesInputValue'),
    data: createArrayParser({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      value: assert.notNull,
    }),
  })],

  [createSchema({
    event: assert.stringEquals('setNodesInputVisibility'),
    data: createArrayParser({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      visible: assert.boolean,
    }),
  })],

  /***************************************************************************/
  /* Links                                                                   */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('createLink'),
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
    event: assert.stringEquals('removeLink'),
    data: createArrayParser({
      sourceId: [[assert.undefined], [assert.stringNotEmpty]],
      sourceName: [[assert.undefined], [assert.stringNotEmpty]],
      sourcePath: [[assert.undefined], [assert.stringNotEmpty]],
      targetId: [[assert.undefined], [assert.stringNotEmpty]],
      targetName: [[assert.undefined], [assert.stringNotEmpty]],
      targetPath: [[assert.undefined], [assert.stringNotEmpty]],
    }),
  })],

  /***************************************************************************/
  /* Request                                                                 */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('searchVariables'),
    data: createArrayParser({
      search: [[assert.undefined], [assert.string]],
    }),
  })],

  [createSchema({
    event: assert.stringEquals('searchOptions'),
    data: createArrayParser({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      query: [[assert.undefined], [assert.string]],
    }),
  })],

  /***************************************************************************/
  /* User                                                                    */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('setUserPosition'),
    data: createArrayParser(assert.number),
  })],

  [createSchema({
    event: assert.stringEquals('userLeave'),
  })],
)

/** The message received from the client in a flow session. */
export type EditorSessionClientMessage = ReturnType<typeof EDITOR_SESSION_CLIENT_MESSAGE_SCHEMA>
export type EditorSessionClientMessageEvent = EditorSessionClientMessage['event']
