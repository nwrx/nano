import type { NmcpManager } from '../../mcpManager'

export type McpServerStatus =
  | NmcpManager.ServerStatus & { isReachable: true }
  | { isReachable: false }

export interface McpServerLog {
  timestamp: string
  message: string
}
