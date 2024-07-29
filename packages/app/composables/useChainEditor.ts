/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { UUID } from 'node:crypto'
import type { ChainObject } from '~/server/chain'
import type { ChainNodeObject, ChainSettings } from '@hsjm/oblisk-core'

export const useChainEditor = createSharedComposable((id: UUID) => {
  const client = useClient()
  const session = client.useSocket('WS /api/chains/editor')
  const chain = ref<ChainObject>({
    id,
    name: '',
    slug: '',
    description: '',
    nodes: [],
    links: {},
  })

  /**
   * When initializing the chain editor, request the chain data from the server.
   * This will trigger the server to send the chain data to the client.
   */
  setTimeout(() => session.send({ id, data: { event: 'refresh' } }), 100)

  /**
   * Handle the incoming messages from the server. This function is called
   * whenever the chain instance is updated from the server. For example, when
   * another user moves, links or updates a node in the chain.
   */
  session.on('message', (payload: { event: string; data: unknown }) => {

    // --- Refresh the chain.
    if (payload.event === 'refresh') {
      const data = payload.data as ChainObject
      chain.value.name = data.name
      chain.value.slug = data.slug
      chain.value.description = data.description
      chain.value.nodes = data.nodes
      // Update in a next tick to avoid reactivity issues.
      void nextTick(() => chain.value.links = data.links)
    }

    // --- Update the chain settings.
    if (payload.event === 'update:settings') {
      const [data] = payload.data as [ChainSettings]
      chain.value.name = data.name
      chain.value.description = data.description
    }

    // --- Update the links between the nodes.
    if (payload.event === 'update:links') {
      const [links] = payload.data as [Record<string, string>]
      chain.value.links = links
    }

    // --- Update the position of the node.
    if (payload.event === 'update:node') {
      const [node] = payload.data as [ChainNodeObject]
      const index = chain.value.nodes.findIndex(n => n.id === node.id)
      if (index === -1) return
      chain.value.nodes[index] = node
      chain.value.links = { ...chain.value.links }
    }
  })

  /**
   * Update the settings of the chain with the given data.
   *
   * @param settings The settings to update.
   */
  function updateSettings(settings: Partial<ChainSettings>) {
    session.send({ id, data: { event: 'updateSettings', ...settings as ChainSettings } })
  }

  /**
   * Handle the user interactions with the chain editor. This function is called
   * whenever the user moves, links or updates a node in the chain.
   *
   * @param nodeId The node id.
   * @param x The x coordinate.
   * @param y The y coordinate.
   */
  function updateNodePosition(nodeId: string, x: number, y: number) {
    session.send({ id, data: { event: 'updateNodePosition', nodeId, x, y } })
    chain.value.links = { ...chain.value.links }
  }

  /**
   * Broadcast the creation of a link between the source and target nodes.
   *
   * @param source The source node id.
   * @param target The target node id.
   */
  function createLink(source: string, target: string) {
    session.send({ id, data: { event: 'createLink', source, target } })
  }

  /**
   * Broadcast the removal of a link between the source and target nodes.
   *
   * @param source The source node id.
   */
  function removeLink(source: string) {
    session.send({ id, data: { event: 'removeLink', source } })
  }

  // --- Return the chain editor composable.
  return { chain, createLink, removeLink, updateSettings, updateNodePosition }
})
