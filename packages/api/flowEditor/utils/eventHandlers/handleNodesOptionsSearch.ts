/* eslint-disable sonarjs/todo-tag */
import type { Peer } from 'crossws'
import type { EditorSession } from '../createEditorSession'
import { getNode, getNodeInputOptions, getNodeInputSocket } from '@nwrx/nano'
import { provider } from '@nwrx/nano/components'
import { assert, createParser } from '@unshared/validation'
import { ModuleVault } from '../../../vault'

/** The parser schema for the `nodes.options.search` event. */
export const MESSAGE_CLIENT_NODES_OPTIONS_SEARCH_SCHEMA = createParser({
  event: assert.stringEquals('nodes.options.search'),
  data: assert.arrayOf({
    id: assert.stringNotEmpty,
    name: assert.stringNotEmpty,
    search: [[assert.undefined], [assert.string]],
  }),
})

/** The type for the `searchOptions` event. */
export type MessageClientNodesOptionsSearch = ReturnType<typeof MESSAGE_CLIENT_NODES_OPTIONS_SEARCH_SCHEMA>

/**
 * Handle the `searchOptions` event in the editor session.
 *
 * @param event The event data containing the search parameters.
 * @param peer The peer that sent the event.
 * @returns A promise that resolves when the search options are sent.
 */
export async function handleNodesOptionsSearch(this: EditorSession, event: MessageClientNodesOptionsSearch, peer: Peer): Promise<void> {
  const [{ id, name, search }] = event.data
  const socket = await getNodeInputSocket(this.thread, id, name)

  // --- If the input expects a Variable reference, search for the variables.
  if (socket['x-control'] === 'reference/variable') {
    const moduleVault = this.moduleFlowEditor.getModule(ModuleVault)
    const variables = await moduleVault.searchVariableByProject({ project: this.project, search, withVault: true })
    const options = variables
      .filter(x => x.vault)
      .map(x => ({
        value: { $ref: `#/Variables/${x.vault!.name}/${x.name}` },
        label: `${x.vault!.name} / **${x.name}**`,
      }))

    // --- Send the search results back to the peer.
    this.sendMessage(peer, {
      event: 'nodes.options.result',
      data: [{ id, name, options }],
    })
  }

  // --- Otherwise, search for the options in the component schema.
  else {
    const options = await getNodeInputOptions(this.thread, id, name)
    // @TODO: Implement search filtering.
    this.sendMessage(peer, { event: 'nodes.options.result', data: [{ id, name, options }] })
  }
}

///

// /** The parser schema for the `nodes.properties.search` event. */
// export const MESSAGE_CLIENT_NODES_PROPERTIES_SEARCH_SCHEMA = createParser({
//   event: assert.stringEquals('nodes.properties.search'),
//   data: assert.arrayOf({
//     id: assert.stringNotEmpty,
//     name: assert.stringNotEmpty,
//     search: [[assert.undefined], [assert.string]],
//   }),
// })

// /** The type for the `searchProperties` event. */
// export type MessageClientNodesPropertiesSearch = ReturnType<typeof MESSAGE_CLIENT_NODES_PROPERTIES_SEARCH_SCHEMA>

// /**
//  * Handle the `searchProperties` event in the editor session.
//  *
//  * @param event The event data containing the search parameters.
//  * @param peer The peer that sent the event.
//  * @returns A promise that resolves when the search properties are sent.
//  */
// export async function handleNodesPropertiesSearch(this: EditorSession, event: MessageClientNodesPropertiesSearch, peer: Peer): Promise<void> {
//   const [{ id, name /* search */ }] = event.data
//   const node = getNode(this.thread, id)

//   // --- If the input expects a provider options, search for the provider options.
//   if (node.component === provider && name === 'options')
//     console.warn('Provider options search is not implemented yet.')

// }
