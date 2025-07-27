/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable no-async-promise-executor */
import type { JSONRPCMessage, McpError, Tool } from '@modelcontextprotocol/sdk/types.js'
import type { Loose } from '@unshared/types'
import type { McpManager } from '../../mcpManager'
import type { McpServer } from '../entities'
import type { ModuleMcpServer } from '../index'
import type { McpServerLog, McpServerStatus } from './types'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'
import { createEventBus } from '@unserved/server'
import { fetch, request } from '@unshared/client/utils'
import { createParser } from '@unshared/validation'
import packageJson from '../../../../package.json' assert { type: 'json' }
import { assertMcpGateway, type McpGateway, ModuleMcpGateway } from '../../mcpGateway'
import { assertMcpManager, ModuleMcpManager } from '../../mcpManager'
import { assertMcpServer } from './assertMcpServer'

type McpServerMessage =
  | { event: 'endpoint'; data: string }
  | { event: 'message'; data: JSONRPCMessage }

export class McpServerClient {
  constructor(
    private readonly moduleServer: ModuleMcpServer,
    private readonly manager: McpManager,
    private readonly gateway: McpGateway,
    private readonly server: McpServer,
  ) {}

  /** The MCP client instance */
  private client?: Client

  async getClient(): Promise<Client> {
    if (this.client) return this.client

    // --- Create the SSE transport for the MCP client. Additionally, intercept the fetch
    // --- requests to capture JSON-RPC messages and send them to the messages event bus.
    const url = new URL(`/${this.server.id}/sse`, this.gateway.address)
    const transport = new SSEClientTransport(url, {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers)
        const contentType = headers.get('Content-Type')
        if (contentType?.startsWith('application/json') && typeof init?.body === 'string') {
          const message = JSON.parse(init.body) as JSONRPCMessage
          void this.messages.sendMessage(message)
        }
        return globalThis.fetch(input, init)
      },
    })

    // --- When the transport is closed, clear the client instance so that
    // --- a new client will be created on the next request.
    transport.onclose = () => {
      this.client = undefined
      void this.logs.sendMessage({ timestamp: new Date().toISOString(), message: 'MCP client transport closed.' })
    }

    // --- Create the MCP client instance.
    const client = new Client({ name: 'nano', version: packageJson.version })
    await client.connect(transport).catch((error: McpError) => {
      throw this.moduleServer.errors.MCP_SERVER_CONNECTION_FAILED(error)
    })

    this.client = client
    return client
  }

  /***************************************************************************/
  /* Logs                                                                    */
  /***************************************************************************/

  private logsAbortController = new AbortController()

  public logs = createEventBus<McpServerLog>({
    onMount: () => void this.subscribeToLogs(),
    onUnmount: () => {
      this.logsAbortController.abort()
      this.logsAbortController = new AbortController()
    },
  })

  private async subscribeToLogs(): Promise<void> {
    const response = await fetch('GET /{id}/logs', {
      baseUrl: this.gateway?.address,
      parameters: { id: this.server.id },
    })

    // --- Check if the response is ok.
    if (!response.ok) throw new Error(`Failed to start logging for MCP server ${this.server.id}: ${response.statusText}`)
    if (!response.body) throw new Error(`No response body for MCP server ${this.server.id}`)
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    // --- Stream each log message
    let remaining = ''
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    void new Promise<void>(async() => {
      while (true) {
        try {
          const { done, value } = await reader.read()
          if (done) break
          const text = decoder.decode(value, { stream: true })
          const data = remaining + text
          const lines = data.split('\n')

          // --- Keep the last line as remaining if it doesn't end with newline
          remaining = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.trim()) continue // Skip empty lines

            // --- If line starts with a timestamp, extract it.
            // --- Example: 2025-07-25T05:02:47.961887372Z
            let timestamp = new Date().toISOString()
            let message = line.trim()
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{9}Z/.test(line)) {
              timestamp = line.slice(0, 29) // Extract the timestamp
              message = line.slice(30).trim() // Extract the message after the timestamp
            }

            // --- Send the message to the events bus.
            void this.logs.sendMessage({ timestamp, message })
          }
        }
        catch { break }
      }
    })
  }

  /***************************************************************************/
  /* Status                                                                  */
  /***************************************************************************/

  /** The interval for polling the status of the MCP server. */
  private statusInterval: NodeJS.Timeout | undefined

  /** The event bus for the MCP server status. */
  public status = createEventBus<McpServerStatus>({
    onMount: () => {
      const moduleManager = this.moduleServer.getModule(ModuleMcpManager)
      const client = moduleManager.getManagerClient(this.manager)
      if (this.statusInterval) clearInterval(this.statusInterval)
      this.statusInterval = setInterval(() => {
        void client.getServer(this.server.id)
          .then(server => this.status.sendMessage({ isReachable: true, ...server.status }))
          .catch(() => this.status.sendMessage({ isReachable: false }))
      }, 1000)
    },
    onUnmount: () => {
      if (!this.statusInterval) return
      clearInterval(this.statusInterval)
      this.statusInterval = undefined
    },
  })

  /***************************************************************************/
  /* Messages                                                                */
  /***************************************************************************/

  private messagesAbortController = new AbortController()

  public messages = createEventBus<JSONRPCMessage>({
    onMount: () => {
      request('GET /{id}/sse', {
        baseUrl: this.gateway.address,
        parameters: { id: this.server.id },
        signal: this.messagesAbortController.signal,
        onData: (message: McpServerMessage) => {
          if (message.event === 'message') return this.messages.sendMessage(message.data)
        },
      })
        .catch((error: Error) => {
          if (error.name === 'AbortError') return
          void this.messages.sendError(error)
        })
    },
    onUnmount: () => {
      this.messagesAbortController.abort()
      this.messagesAbortController = new AbortController()
    },
  })

  /***************************************************************************/
  /* Lifecycle                                                               */
  /***************************************************************************/

  async request(): Promise<void> {
    const moduleGateway = this.moduleServer.getModule(ModuleMcpGateway)
    const client = moduleGateway.getGatewayClient(this.gateway)
    await client.request(this.server.id)
  }

  async shutdown(): Promise<void> {
    const moduleGateway = this.moduleServer.getModule(ModuleMcpGateway)
    const client = moduleGateway.getGatewayClient(this.gateway)
    await client.shutdown(this.server.id)
  }

  /***************************************************************************/
  /* Requests                                                                */
  /***************************************************************************/

  async listTools(): Promise<Tool[]> {
    try {
      const client = await this.getClient()
      const { tools } = await client.listTools()
      return tools
    }
    catch (error) {
      throw this.moduleServer.errors.MCP_SERVER_REQUEST_ERROR(error as McpError)
    }
  }
}

const CREATE_MCP_SERVER_CLIENT_OPTIONS_SCHEMA = createParser({
  manager: assertMcpManager,
  gateway: assertMcpGateway,
  server: assertMcpServer,
})

/** The options for getting an MCP server client. */
export type CreateMcpServerClientOptions = Loose<ReturnType<typeof CREATE_MCP_SERVER_CLIENT_OPTIONS_SCHEMA>>

/**
 * Create an MCP server client for a given workspace, pool, and server.
 * This function will connect to the MCP server using the SSE transport.
 *
 * @param options The options for creating the MCP server client.
 * @returns The MCP server client instance.
 */
export function createMcpServerClient(this: ModuleMcpServer, options: CreateMcpServerClientOptions): McpServerClient {
  const { manager, gateway, server } = CREATE_MCP_SERVER_CLIENT_OPTIONS_SCHEMA(options)
  return new McpServerClient(this, manager, gateway, server)
}
