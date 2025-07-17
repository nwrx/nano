import type { McpPoolSpec } from './assertMcpPoolSpec'

export const DEFAULT_MCP_POOL_SPEC: McpPoolSpec = {
  maxServersActive: 10,
  maxServersLimit: 100,
  defaultIdleTimeout: 300,
}
