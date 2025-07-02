import { assert, createParser, createRuleSet } from '@unshared/validation'

export const EDITOR_SESSION_CLIENT_MESSAGE_SCHEMA = createRuleSet(

  /***************************************************************************/
  /* Flow                                                                    */
  /***************************************************************************/

  [createParser({
    event: assert.stringEquals('syncronize'),
  })],

  [createParser({
    event: assert.stringEquals('setMetadata'),
    data: assert.arrayOf({
      name: assert.stringEnum('title', 'description'),
      value: assert.string,
    }),
  })],
  [createParser({
    event: assert.stringEquals('getFlowExport'),
    data: assert.arrayOf({
      format: [[assert.undefined], [assert.stringEnum('json', 'yaml')]],
    }),
  })],

  /***************************************************************************/
  /* Nodes                                                                   */
  /***************************************************************************/

  [createParser({
    event: assert.stringEquals('createNodes'),
    data: assert.arrayOf({
      specifier: assert.stringNotEmpty,
      x: assert.number,
      y: assert.number,
    }),
  })],
  [createParser({
    event: assert.stringEquals('cloneNodes'),
    data: assert.arrayOf({
      ids: assert.arrayOf(assert.stringNotEmpty),
      origin: createParser({
        x: assert.number,
        y: assert.number,
      }),
    }),
  })],
  [createParser({
    event: assert.stringEquals('removeNodes'),
    data: assert.arrayOf(assert.stringNotEmpty),
  })],
  [createParser({
    event: assert.stringEquals('setNodesMetadata'),
    data: assert.arrayOf({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      value: assert.notNull,
    }),
  })],
  [createParser({
    event: assert.stringEquals('setNodesInputValue'),
    data: assert.arrayOf({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      value: assert.notNull,
    }),
  })],
  [createParser({
    event: assert.stringEquals('searchOptions'),
    data: assert.arrayOf({
      id: assert.stringNotEmpty,
      name: assert.stringNotEmpty,
      search: [[assert.undefined], [assert.string]],
    }),
  })],

  /***************************************************************************/
  /* Links                                                                   */
  /***************************************************************************/

  [createParser({
    event: assert.stringEquals('createLinks'),
    data: assert.arrayOf({
      sourceId: assert.stringNotEmpty,
      sourceName: assert.stringNotEmpty,
      sourcePath: [[assert.undefined], [assert.stringNotEmpty]],
      targetId: assert.stringNotEmpty,
      targetName: assert.stringNotEmpty,
      targetPath: [[assert.undefined], [assert.stringNotEmpty]],
    }),
  })],
  [createParser({
    event: assert.stringEquals('removeLinks'),
    data: assert.arrayOf({
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

  [createParser({
    event: assert.stringEquals('setUserPosition'),
    data: assert.arrayOf(assert.number),
  })],
  [createParser({
    event: assert.stringEquals('userLeave'),
  })],

  /***************************************************************************/
  /* Request                                                                 */
  /***************************************************************************/

)

/** The message received from the client in a flow session. */
export type EditorSessionClientMessage = ReturnType<typeof EDITOR_SESSION_CLIENT_MESSAGE_SCHEMA>
export type EditorSessionClientMessageEvent = EditorSessionClientMessage['event']
