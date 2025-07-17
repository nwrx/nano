import type { McpServerSpec } from './assertMcpServerSpec'

export const DEFAULT_MCP_SERVER_SPEC: McpServerSpec = {
  image: 'docker.io/mcp/fetch:latest',
  command: [],
  idleTimeout: 30000,
  transport: {
    port: 8080,
    type: 'stdio',
  },
}
