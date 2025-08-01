import type { Peer } from 'crossws'
import type { EditorSession } from '../createEditorSession'
import { serialize } from '@nwrx/nano'
import { assert, createParser } from '@unshared/validation'
import * as YAML from 'yaml'

/** The parser schema for the `getFlowExport` event. */
export const MESSAGE_CLIENT_REQUEST_EXPORT_SCHEMA = createParser({
  event: assert.stringEquals('request.export'),
  data: assert.arrayOf({
    format: assert.stringEnum(['json', 'yaml']),
  }),
})

/** The type for the `getFlowExport` event. */
export type MessageClientRequestExport = ReturnType<typeof MESSAGE_CLIENT_REQUEST_EXPORT_SCHEMA>

/**
 * Handle the `getFlowExport` event in the editor session.
 *
 * @param event The event data containing the export format.
 * @param peer The peer that sent the event.
 */
export function handleExportRequest(this: EditorSession, event: MessageClientRequestExport, peer: Peer): void {
  const [{ format }] = event.data
  const data = serialize(this.thread, {
    name: this.flow.name,
    description: this.flow.description,
  })

  // --- Format the data based on the requested format.
  const formatted = format === 'json'
    ? JSON.stringify(data, undefined, 2)
    : YAML.stringify(data)

  // --- Send the formatted data back to the peer.
  this.sendMessage(peer, { event: 'request.export.result', data: [formatted] })
}
