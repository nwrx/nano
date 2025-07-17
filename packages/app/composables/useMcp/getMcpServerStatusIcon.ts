import type { McpServerObject } from '@nwrx/nano-api'

export function getMcpServerStatusIcon(server: McpServerObject) {
  if (server.disabledAt) return 'i-carbon:dot-mark'
  if (server.lastPhase === 'Idle') return 'i-carbon:pause-filled'
  if (server.lastPhase === 'Requested') return 'i-carbon:play-filled'
  if (server.lastPhase === 'Running') return 'i-carbon:play'
  if (server.lastPhase === 'Starting') return 'i-carbon:play-filled'
  if (server.lastPhase === 'Stopping') return 'i-carbon:stop'
  if (server.lastPhase === 'Failed') return 'i-carbon:warning'
  return 'i-carbon:pause-filled'
}
