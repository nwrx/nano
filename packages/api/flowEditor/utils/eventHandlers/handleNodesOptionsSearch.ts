/* eslint-disable sonarjs/todo-tag */
import type { Provider } from '@nwrx/ai'
import type { Peer } from 'crossws'
import type { EditorSession } from '../createEditorSession'
import { createClient } from '@nwrx/ai'
import { getNode, getNodeInputOptions, getNodeInputSocket, startNode } from '@nwrx/nano'
import { isNodeReadyToStart, isReference, parseReference, type SchemaOption } from '@nwrx/nano/utils'
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

/** The result type for the `nodes.options.result` event. */
export interface MessageServerNodesOptionsResult {
  event: 'nodes.options.result'
  data: Array<{
    id: string
    name: string
    options: SchemaOption[]
  }>
}

/**
 * Handle the `searchOptions` event in the editor session.
 *
 * @param event The event data containing the search parameters.
 * @param peer The peer that sent the event.
 * @returns A promise that resolves when the search options are sent.
 */
export async function handleNodesOptionsSearch(this: EditorSession, event: MessageClientNodesOptionsSearch, peer: Peer): Promise<void> {
  const [{ id, name, search }] = event.data
  const node = getNode(this.thread, id)
  const socket = await getNodeInputSocket(this.thread, id, name)

  // --- Handle the `model-chat/model` options based on provider.
  const getOptions = async(): Promise<SchemaOption[] | undefined> => {
    if (socket['x-control'] === 'reference/provider-model') {
      const provider = node.input.provider

      // --- There are 3 scenarios at this point:
      // --- 1. the `provider` is not set, which means we cannot search for options.
      if (!provider) return
      if (!isReference(provider)) return
      const [type, ...values] = parseReference(provider)

      // --- 2. the `provider` is a { $ref: `#/Nodes/<nodeId>/provider` } reference, which means the data is located in another node in the thread.
      if (type ==='Nodes') {
        const [id, name] = values
        const node = getNode(this.thread, id)
        if (!node) return
        const isNodeReady = isNodeReadyToStart(this.thread, id)
        if (!isNodeReady) return
        const nodeResult = await startNode(this.thread, id) as { provider: Provider }
        const client = createClient(nodeResult.provider.name, nodeResult.provider.options)
        const searchResult = await client.searchModels()
        return searchResult.models.map(model => ({
          value: model.name,
          label: model.title ?? model.name,
          description: model.description ?? model.name,
        }))
      }

      // --- 3. the `provider` is a { $ref: `#/Providers/${provider}` } reference, which means we will use the database to resolve the provider. (NOT IMPLEMENTED YET)
    }

    // --- If the input expects a Variable reference, search for the variables.
    else if (socket['x-control'] === 'reference/variable') {
      const moduleVault = this.moduleFlowEditor.getModule(ModuleVault)
      const variables = await moduleVault.searchVariableByProject({ project: this.project, search, withVault: true })
      return variables
        .filter(x => x.vault)
        .map(x => ({
          value: { $ref: `#/Variables/${x.vault!.name}/${x.name}` },
          label: `${x.vault!.name} / **${x.name}**`,
        }))
    }

    else {
      return await getNodeInputOptions(this.thread, id, name)
    }
  }

  // --- Get and send the result
  const options = await getOptions() ?? []
  this.sendMessage(peer, {
    event: 'nodes.options.result',
    data: [{ id, name, options }],
  })
}
