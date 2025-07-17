import type { McpServerObject } from '@nwrx/nano-api'

export function getMcpServerStatusColor(server: McpServerObject) {
  if (server.disabledAt) return 'text-warning'
  if (server.lastPhase === 'Idle') return 'text-subtle'
  if (server.lastPhase === 'Requested') return 'text-success'
  if (server.lastPhase === 'Running') return 'text-success'
  if (server.lastPhase === 'Starting') return 'text-success'
  if (server.lastPhase === 'Stopping') return 'text-warning'
  if (server.lastPhase === 'Failed') return 'text-danger'
  return 'text-subtle'
}
