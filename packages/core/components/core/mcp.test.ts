/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable sonarjs/no-clear-text-protocols */
/* eslint-disable unicorn/prefer-add-event-listener */
import type { Tool } from '../../utils'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import { createResolvable } from '@unshared/functions'
import { createApp, createRouter, defineEventHandler, getQuery, readBody, setResponseHeader, toNodeListener } from 'h3'
import { randomUUID } from 'node:crypto'
import { request, Server } from 'node:http'
import { z } from 'zod'
import { addNode, createThread, getNodeComponent, startNode } from '../../thread'
import { ERRORS } from '../../utils'

class MCPServer {
  id = randomUUID()
  socketPath = `/tmp/${this.id}.sock`
  server: Server | undefined
  transports: Record<string, SSEServerTransport> = {}

  getMcpServer() {
    const server = new McpServer({ name: 'example-server', version: '1.0.0' })
    server.registerTool('sum', {
      description: 'The sum of two numbers.',
      inputSchema: {
        a: z.number(),
        b: z.number(),
      },
      outputSchema: {
        result: z.number(),
      },
    }, ({ a, b }) => ({
      content: [{
        type: 'text',
        text: `The sum of ${a} and ${b} is ${a + b}.`,
      }],
      structuredContent: {
        result: a + b,
      },
    }))
    return server
  }

  async setup() {
    const router = createRouter()
    const transports: Record<string, SSEServerTransport> = {}

    router.get('/sse', defineEventHandler(async(event) => {
      const transport = new SSEServerTransport('/messages', event.node.res)
      this.transports[transport.sessionId] = transport
      transport.onclose = () => { delete transports[transport.sessionId] }
      const server = this.getMcpServer()
      await server.connect(transport)
    }))

    router.post('/messages', defineEventHandler(async(event) => {
      const sessionId = getQuery(event).sessionId as string
      const parsedBody: Record<string, unknown> = await readBody(event)
      const transport = this.transports[sessionId]
      if (!transport) throw new Error(`No transport found for sessionId: ${sessionId}`)
      setResponseHeader(event, 'Content-Type', 'application/json')
      event.node.req.headers['content-type'] = 'application/json'
      await transport.handlePostMessage(event.node.req, event.node.res, parsedBody)
    }))

    const app = createApp()
    app.use('/', router.handler)
    this.server = new Server(toNodeListener(app))
    return await new Promise<void>((resolve) => {
      this.server!.listen(this.socketPath, resolve)
    })
  }

  async fetch(url: string | URL, options: RequestInit = {}): Promise<Response> {
    const { method = 'GET', headers = {}, body, signal } = options
    const resolvable = createResolvable<Response>()
    url = typeof url === 'string' ? new URL(url) : url

    const normalizedHeaders: Record<string, string> = {}
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value === 'string')
        normalizedHeaders[key.toLowerCase()] = value
      else if (Array.isArray(value))
        normalizedHeaders[key.toLowerCase()] = value.join(', ')
      else if (value !== undefined && value !== null)
        normalizedHeaders[key.toLowerCase()] = String(value)
    }

    const clientRequest = request({
      path: url.pathname + url.search,
      method,
      socketPath: this.socketPath,
      headers: normalizedHeaders,
      signal: signal ?? undefined,
    },

    // --- Handle incoming response.
    (response) => {
      response.url = url.toString()

      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          response.on('data', (chunk: Uint8Array) => controller.enqueue(chunk) )
          response.on('error', error => controller.error(error))
          response.on('end', () => controller.close())
        },
      })

      const bytes = async() => {
        const reader = body.getReader()
        const chunks: Uint8Array[] = []
        while (true) {
          const { done, value } = await reader.read()
          if (done || !value) break
          chunks.push(value)
        }
        const buffer = Buffer.concat(chunks)
        return Uint8Array.from(buffer)
      }

      const text = async() => {
        const buffer = await bytes()
        return [...buffer].map(x => String.fromCodePoint(x)).join('')
      }

      resolvable.resolve({
        ok: response.statusCode! >= 200 && response.statusCode! < 300,
        url: response.url,
        status: response.statusCode!,
        statusText: response.statusMessage!,
        headers: new Headers(response.headers as Record<string, string>),
        body,
        get bodyUsed() { return body.locked },
        bytes,
        text,
        json: () => text().then(JSON.parse),
        arrayBuffer: () => bytes().then(buffer => buffer.buffer),
      } as Response)
    })

    // --- Write the request body.
    if (body) clientRequest.write(body)
    clientRequest.on('error', resolvable.reject)
    clientRequest.end()
    return resolvable.promise
  }

  async dispose() {
    for (const transport of Object.values(this.transports))
      await transport.close()
    if (this.server) {
      return new Promise<void>((resolve, reject) => {
        this.server!.close((error) => {
          if (error) reject(error)
          else resolve()
        })
      })
    }
  }
}

interface Context {
  mcpServer: MCPServer
}

describe('mcp component', () => {
  describe('input validation', () => {
    it('should be included in the native components', async() => {
      const thread = createThread()
      const id = addNode(thread, 'mcp')
      const component = await getNodeComponent(thread, id)
      expect(component).toBeDefined()
    })

    it('should throw an error if the endpoint is not provided', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'mcp', { input: { endpoint: undefined } })
      const shouldThrow = startNode(thread, nodeId)
      const error = ERRORS.NODE_INPUT_SCHEMA_MISMATCH(nodeId, { endpoint: ERRORS.INPUT_REQUIRED('endpoint') })
      await expect(shouldThrow).rejects.toThrow(error)
    })
  })

  describe<Context>('basic functionality', () => {
    beforeEach<Context>(async(context) => {
      context.mcpServer = new MCPServer()
      await context.mcpServer.setup()
      const fetch = context.mcpServer.fetch.bind(context.mcpServer)
      vi.stubGlobal('fetch', fetch)
    })

    afterEach<Context>(async(context) => {
      await context.mcpServer.dispose()
      vi.unstubAllGlobals()
    })

    it('should connect to the MCP server and return the sum of two numbers', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'mcp', { input: { endpoint: 'http://example-mcp-server.com/sse' } })
      const result = await startNode(thread, nodeId)
      expect(result).toStrictEqual({
        tools: [{
          nodeId,
          name: 'sum',
          description: 'The sum of two numbers.',
          inputSchema: {
            properties: { a: { type: 'number' }, b: { type: 'number' } },
            required: ['a', 'b'],
            type: 'object',
          },
          call: expect.any(Function),
        }],
      })
    })

    it('should call the sum tool and return the result', async() => {
      const thread = createThread()
      const nodeId = addNode(thread, 'mcp', { input: { endpoint: 'http://example-mcp-server.com/sse' } })
      const result = await startNode(thread, nodeId) as { tools: Tool[] }
      const callResult = await result.tools[0].call({ a: 5, b: 10 })
      expect(callResult).toStrictEqual({
        content: [{ type: 'text', text: 'The sum of 5 and 10 is 15.' }],
        structuredContent: { result: 15 },
      })
    })
  })
})
