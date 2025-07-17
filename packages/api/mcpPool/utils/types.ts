import type { McpPoolSpec } from './assertMcpPoolSpec'

export interface McpPoolStatus {
  isSynchronized: boolean
  activeServersCount: number
  managedServersCount: number
  pendingServersCount: number
  totalServersCount: number
  unmanagedServersCount: number
  remoteSpec: McpPoolSpec
  localSpec: McpPoolSpec
}
