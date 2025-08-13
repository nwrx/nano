/* eslint-disable sonarjs/todo-tag */
import type { ProviderName } from '@nwrx/ai'
import type { Node } from '@nwrx/nano'
import type { Schema } from '@nwrx/nano/utils'
import type { Peer } from 'crossws'
import type { EditorSession } from '../createEditorSession'
import * as PROVIDERS from '@nwrx/ai/providers'
import { getNode } from '@nwrx/nano'
import { provider } from '@nwrx/nano/components'
import { assert, createParser } from '@unshared/validation'

/** The parser schema for the `nodes.properties.search` event. */
export const MESSAGE_CLIENT_NODES_PROPERTIES_SEARCH_SCHEMA = createParser({
  event: assert.stringEquals('nodes.properties.search'),
  data: assert.arrayOf({
    id: assert.stringNotEmpty,
    name: assert.stringNotEmpty,
    search: [[assert.undefined], [assert.string]],
  }),
})

/** The type for the `searchProperties` event. */
export type MessageClientNodesPropertiesSearch = ReturnType<typeof MESSAGE_CLIENT_NODES_PROPERTIES_SEARCH_SCHEMA>

/** The result type for the `nodes.properties.result` event. */
export interface MessageServerNodesPropertiesResult {
  event: 'nodes.properties.result'
  data: Array<{
    id: string
    name: string
    properties: Record<string, Schema>
  }>
}

function isCoreComponent(node: Node) {
  return node.registry === 'default'
    && node.workspace === 'default'
    && node.collection === 'default'
    && node.tag === 'latest'
}

/**
 * Handle the `searchProperties` event in the editor session.
 *
 * @param event The event data containing the search parameters.
 * @param peer The peer that sent the event.
 * @returns void
 */
export function handleNodesPropertiesSearch(this: EditorSession, event: MessageClientNodesPropertiesSearch, peer: Peer): void {
  const [{ id, name /* search */ }] = event.data
  const node = getNode(this.thread, id)

  // --- Handle the `provider/options` input for core components.
  if (isCoreComponent(node) && node.name === 'provider' && name === 'options') {
    const properties: Record<string, Schema> = {}
    const providerName = node.input.name as ProviderName
    const providerConfig = PROVIDERS[providerName]
    if (!providerConfig) {
      return this.sendMessage(peer, {
        event: 'error',
        data: {
          name: 'E_PROVIDER_NOT_SUPPORTED',
          message: `Provider ${providerName} is not supported.`,
        },
      })
    }

    // --- Collect the properties from the provider configuration.
    for (const name in providerConfig.parameters) {
      const parameter = providerConfig.parameters[name as keyof typeof providerConfig.parameters]
      if (!parameter.schema) continue
      properties[name] = { ...parameter.schema } as Schema
    }

    // --- Send the search results back to the peer.
    this.sendMessage(peer, {
      event: 'nodes.properties.result',
      data: [{ id, name, properties }],
    })
  }

  else {
    this.sendMessage(peer, {
      event: 'error',
      data: {
        name: 'E_NOT_SUPPORTED',
        message: `Node ${id} does not support properties search for input ${name}.`,
      },
    })
  }
}
