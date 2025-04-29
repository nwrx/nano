import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'
import type * as Types from '@modelcontextprotocol/sdk/types.js'
import { randomUUID } from 'node:crypto'
import { createMcp, MCP } from './createMcp'
import { defineTool } from './defineTool'

class TestTransport implements Transport {
  messages: unknown[] = []
  sessionId = randomUUID()
  onclose?: () => void
  onerror?: (error: Error) => void
  onmessage?: (message: Types.JSONRPCMessage) => void
  constructor() {}

  async start(): Promise<void> {
    // await this.mcp.server.connect(this)
  }

  send(message: Types.JSONRPCRequest) {
    console.log(message)
    return Promise.resolve()
  }

  receive(message: Types.JSONRPCResponse) {
    this.onmessage?.(message)
  }

  close(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

describe('createMcp', () => {
  describe('initialization', () => {
    it('should create an MCP instance', () => {
      const mcp = createMcp()
      expect(mcp).toBeInstanceOf(MCP)
    })

    it('should create an MCP instance with a name and version', () => {
      const mcp = createMcp({ name: 'test', instructions: 'Test MCP', version: '0.4.2' })
      // @ts-expect-error: ignore
      expect(mcp.server._serverInfo).toEqual({ name: 'test', version: '0.4.2' })
    })
  })

  describe('listTools', () => {
    it('should create an MCP instance with the given tools', async() => {
      const mcp = createMcp({
        tools: [defineTool(
          { name: 'test' },
          () => ({ message: 'Hello, world!' }),
        )],
      })
      const transport = new TestTransport()
      await mcp.connect(transport)
      transport.onmessage = (message) => {
        console.log(message)
      }
      await transport.receive({
        jsonrpc: '2.0',
        id: 1,
        method: 'message',
        params: { method: 'tools/list' },
      })
    })
  })
})
