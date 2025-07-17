import type { McpServerObject } from '@nwrx/nano-api'

export function getMcpServerStatusBadge(server: McpServerObject) {
  if (server.disabledAt) return 'badge-warning'
  if (server.lastPhase === 'Requested') return 'badge-success'
  if (server.lastPhase === 'Running') return 'badge-success'
  if (server.lastPhase === 'Starting') return 'badge-success'
  if (server.lastPhase === 'Stopping') return 'badge-warning'
  if (server.lastPhase === 'Failed') return 'badge-danger'
}
