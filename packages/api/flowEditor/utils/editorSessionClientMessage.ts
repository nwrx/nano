import { assert, createArrayParser, createRuleSet, createSchema } from '@unshared/validation'

export const EDITOR_SESSION_CLIENT_MESSAGE_SCHEMA = createRuleSet(

  /***************************************************************************/
  /* Flow                                                                    */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('syncronize'),
  })],

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
      ids: createArrayParser(assert.stringNotEmpty),
      origin: createSchema({
        x: assert.number,
        y: assert.number,
      }),
    }),
  })],
  [createSchema({
    event: assert.stringEquals('removeNodes'),
    data: createArrayParser(assert.stringNotEmpty),
  })],
  [createSchema({
    event: assert.stringEquals('setNodesMetadata'),
    data: createArrayParser({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      value: assert.notNull,
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

  /***************************************************************************/
  /* Links                                                                   */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('createLinks'),
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
    event: assert.stringEquals('removeLinks'),
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
  /* User                                                                    */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('setUserPosition'),
    data: createArrayParser(assert.number),
  })],
  [createSchema({
    event: assert.stringEquals('userLeave'),
  })],

  /***************************************************************************/
  /* Request                                                                 */
  /***************************************************************************/

  [createSchema({
    event: assert.stringEquals('getFlowExport'),
    data: createArrayParser({
      format: [[assert.undefined], [assert.stringEnum('json', 'yaml')]],
    }),
  })],
  [createSchema({
    event: assert.stringEquals('searchOptions'),
    data: createArrayParser({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      search: [[assert.undefined], [assert.string]],
    }),
  })],
)

/** The message received from the client in a flow session. */
export type EditorSessionClientMessage = ReturnType<typeof EDITOR_SESSION_CLIENT_MESSAGE_SCHEMA>
export type EditorSessionClientMessageEvent = EditorSessionClientMessage['event']
