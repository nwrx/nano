/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { ServerOptions } from '@modelcontextprotocol/sdk/server/index.js'
import type { McpToolHandler, McpToolOptions } from './defineTool'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'
import * as Types from '@modelcontextprotocol/sdk/types.js'
import { Once } from '@unshared/decorators'
import { Emitter } from '@unshared/functions/createEmitter'
import { MaybePromise } from '@unshared/types'
import { AppOptions, createApp, createRouter, defineEventHandler, getQuery, toNodeListener } from 'h3'
import { randomUUID, UUID } from 'node:crypto'
import { createServer } from 'node:http'
import { Readable, Writable } from 'node:stream'
import { format } from 'node:util'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import { definePrompt, McpPrompt, McpPromptHandler, McpPromptOptions } from './definePrompt'
import { defineTool, McpTool } from './defineTool'

export interface McpServerOptions extends ServerOptions {
  name?: string
  version?: string
  tools?: McpTool[]
  prompts?: McpPrompt[]
  listResources?: () => MaybePromise<Types.Resource[]>
  listResourceTemplates?: () => MaybePromise<Types.ResourceTemplate[]>
  getResource?: (uri: string) => MaybePromise<Types.ReadResourceResult['contents']>
}

export type McpServerLogger = Record<Types.LoggingLevel, (...args: any[]) => void>

export type McpEventMap = {
  'request': [id: UUID, Types.Request]
  'result': [id: UUID, Types.Result]
  'toolListChanged': []
  'promptListChanged': []
  'resourceListChanged': []
  'resourceUpdated': [uri: string]
}

export class MCP<T extends McpServerOptions = McpServerOptions> extends Emitter<McpEventMap> {

  /** The current log level. */
  logLevel: Types.LoggingLevel = 'info'

  /** The MCP server instance. */
  server: Server

  /** A map of the sessions and their transports. */
  transports = new Map<string, SSEServerTransport | StdioServerTransport>()

  /** The tools registered with the server. */
  tools: McpTool[] = []

  /** The prompts registered with the server. */
  prompts: McpPrompt[] = []

  /**
   * Create a new instance of the MCP server.
   *
   * @param options The options of the server.
   */
  constructor(readonly options = {} as T) {
    super()
    const {
      name = 'unmcp',
      version = '0.0.0',
      tools = [],
      prompts = [],
      getResource,
      listResources = () => [],
      listResourceTemplates = () => [],
      ...serverOptions
    } = options

    // --- Set the options.
    this.tools = tools
    this.prompts = prompts

    // --- Instantiate the MCP server.
    this.server = new Server({ name, version }, {
      enforceStrictCapabilities: false,
      capabilities: {
        logging: { levels: ['debug', 'info', 'warn', 'error'] },
        tools: { listChanged: true },
        prompts: { listChanged: true },
        resources: { listChanged: true },
      },
      ...serverOptions,
    })

    // --- List tools.
    this.server.setRequestHandler(Types.ListToolsRequestSchema, (request) => {
      const id = randomUUID()
      this.dispatch('request', id, request)
      const result = {
        tools: this.tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.parseInput instanceof z.ZodSchema
            ? zodToJsonSchema(tool.parseInput)
            : tool.inputSchema ?? { type: 'object' },
        })),
      }
      this.dispatch('result', id, result)
      return result
    })

    // --- Call tools.
    this. server.setRequestHandler(Types.CallToolRequestSchema, async(request) => {
      const id = randomUUID()
      this.dispatch('request', id, request)
      try {
        const tool = this.tools.find(tool => tool.name === request.params.name)
        if (!tool) throw new Error(`Tool not found: ${request.params.name}`)
        const input = tool.parseInput instanceof z.ZodSchema
          ? await tool.parseInput.parseAsync(request.params.arguments) as object
          : request.params.arguments ?? {}
        const result = tool.handler.call(this, { server: this, input }) ?? {}
        this.dispatch('result', id, result as Types.Result)
        return result
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        return {
          content: [{ type: 'text', text: `Error: ${errorMessage}` }],
          isError: true,
        }
      }
    })

    // --- List prompts.
    this.server.setRequestHandler(Types.ListPromptsRequestSchema, (request) => {
      const id = randomUUID()
      this.dispatch('request', id, request)
      const result = {
        prompts: this.prompts.map(prompt => ({
          name: prompt.name,
          description: prompt.description,
          arguments: prompt.arguments?.map(name => (typeof name === 'string' ? { name, required: false } : name)) ?? [],
        })),
      }
      this.dispatch('result', id, result)
      return result
    })

    // --- Get prompts.
    this.server.setRequestHandler(Types.GetPromptRequestSchema, (request) => {
      const id = randomUUID()
      this.dispatch('request', id, request)
      try {
        const prompt = this.prompts.find(prompt => prompt.name === request.params.name)
        if (!prompt) throw new Error(`Prompt not found: ${request.params.name}`)
        const args = request.params.arguments ?? {}
        const messages = prompt.handler.call(this, { server: this, args })
        const result = { description: prompt.description, messages }
        this.dispatch('result', id, result)
        return result
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        return {
          description: 'Error',
          messages: [{ role: 'assistant', content: `Error: ${errorMessage}` }],
        }
      }
    })

    // --- Set the log level.
    this.server.setRequestHandler(Types.SetLevelRequestSchema, (request) => {
      const id = randomUUID()
      this.dispatch('request', id, request)
      this.logLevel = request.params.level
      const result = { level: this.logLevel }
      this.dispatch('result', id, result)
      return result
    })

    // --- List resources.
    this.server.setRequestHandler(Types.ListResourcesRequestSchema, async(request) => {
      const id = randomUUID()
      this.dispatch('request', id, request)
      try {
        const result = { resources: await listResources() }
        this.dispatch('result', id, result)
        return result
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        return { resources: [], error: errorMessage }
      }
    })

    // --- List resource templates.
    this.server.setRequestHandler(Types.ListResourceTemplatesRequestSchema, async(request) => {
      const id = randomUUID()
      this.dispatch('request', id, request)
      try {
        const resourceTemplates = await listResourceTemplates()
        const result = { resourceTemplates }
        this.dispatch('result', id, result)
        return result
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        return {
          resourceTemplates: [],
          error: errorMessage,
        }
      }
    })

    // --- Read resources.
    this.server.setRequestHandler(Types.ReadResourceRequestSchema, async(request) => {
      const id = randomUUID()
      this.dispatch('request', id, request)
      try {
        if (!getResource) throw new Error('Resource retrieval is not supported by this server')
        const contents: Types.ReadResourceResult['contents'] = await getResource(request.params.uri)
        const result = { contents }
        this.dispatch('result', id, result)
        return { contents }
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        return {
          contents: [],
          error: errorMessage,
        }
      }
    })
  }

  /**
   * The logger of the server. The logger is a proxy object that allows logging messages of different
   * levels. The logger will send the logging messages to the clients and display them in the console.
   *
   * @returns The logger of the server.
   * @example
   * mcp.log.info('Hello, world!')
   * mcp.log.warn('Something went wrong!')
   * mcp.log.error('An error occurred!')
   */
  get log(): McpServerLogger {
    return new Proxy({}, {
      get: (_, level: Types.LoggingLevel) => {
        const isLevelValid = Types.LoggingLevelSchema.safeParse(level).success
        if (!isLevelValid) return
        return (...args: any[]) => {
          const message = format(args)
          return this.server.sendLoggingMessage({ level, message })
        }
      },
    }) as McpServerLogger
  }

  /**
   * Add a tool to the server and notify the clients. If a tool with the same name already exists,
   * an error will be thrown. The tool will be added to the list of tools and the clients will be
   * notified of the change.
   *
   * @param tool The specification of the tool to add.
   * @param handler The handler of the tool.
   * @returns A promise that resolves when the clients have been notified.
   * @example mcp.addTool({ name: 'echo', description: 'Echo the input.', ... }, ({ input }) => input)
   */
  addTool<T extends McpToolOptions, R extends object>(tool: T, handler: McpToolHandler<T, R>) {
    for (const { name } of this.tools)
      if (name === tool.name) throw new Error(`Tool already exists: ${tool.name}`)
    const newTool = defineTool(tool, handler)
    this.tools.push(newTool)
    this.dispatch('toolListChanged')
    return this.server.sendToolListChanged()
  }

  /**
   * Remove a tool from the server and notify the clients. If a tool with the specified name does
   * not exist, an error will be thrown. The tool will be removed from the list of tools and the
   * clients will be notified of the change.
   *
   * @param name The name of the tool to remove.
   * @returns A promise that resolves when the clients have been notified.
   * @example mcp.removeTool('echo')
   */
  removeTool(name: string) {
    const index = this.tools.findIndex(tool => tool.name === name)
    if (index === -1) throw new Error(`Tool not found: ${name}`)
    this.tools.splice(index, 1)
    this.dispatch('toolListChanged')
    return this.server.sendToolListChanged()
  }

  /**
   * Add a prompt to the server and notify the clients. If a prompt with the same name already exists,
   * an error will be thrown. The prompt will be added to the list of prompts and the clients will be
   * notified of the change.
   *
   * @param prompt The specification of the prompt to add.
   * @param handler The handler of the prompt.
   * @returns A promise that resolves when the clients have been notified.
   * @example mcp.addPrompt({ name: 'greet', description: 'Greet the user.', ... }, ({ args }) => [...])
   */
  addPrompt<T extends McpPromptOptions>(prompt: T, handler: McpPromptHandler<T>) {
    for (const { name } of this.prompts)
      if (name === prompt.name) throw new Error(`Prompt already exists: ${prompt.name}`)
    const newPrompt = definePrompt(prompt, handler)
    this.prompts.push(newPrompt)
    this.dispatch('promptListChanged')
    return this.server.sendPromptListChanged()
  }

  /**
   * Remove a prompt from the server and notify the clients. If a prompt with the specified name does
   * not exist, an error will be thrown. The prompt will be removed from the list of prompts and the
   * clients will be notified of the change.
   *
   * @param name The name of the prompt to remove.
   * @returns A promise that resolves when the clients have been notified.
   * @example mcp.removePrompt('greet')
   */
  removePrompt(name: string) {
    const index = this.prompts.findIndex(prompt => prompt.name === name)
    if (index === -1) throw new Error(`Prompt not found: ${name}`)
    this.prompts.splice(index, 1)
    this.dispatch('promptListChanged')
    return this.server.sendPromptListChanged()
  }

  /**
   * Notify the clients that the list of resources has changed.
   *
   * @returns A promise that resolves when the clients have been notified.
   * @example mcp.notifyResourceListChanged()
   */
  notifyResourceListChanged() {
    this.dispatch('resourceListChanged')
    return this.server.sendResourceListChanged()
  }

  /**
   * Notify the clients that a resource has been updated.
   *
   * @param uri The URI of the resource that has been updated.
   * @returns A promise that resolves when the clients have been notified.
   * @example mcp.notifyResourceUpdated('gif://3o7TKz9bZxwYXfzqJm')
   */
  notifyResourceUpdated(uri: string) {
    this.dispatch('resourceUpdated', uri)
    return this.server.sendResourceUpdated({ uri })
  }

  /**
   * Attaches to the given transport, starts it, and starts listening for messages.
   *
   * The Protocol object assumes ownership of the Transport, replacing any callbacks that have already been set,
   * and expects that it is the only user of the Transport instance going forward.
   *
   * @param transport The transport to connect to the server.
   * @returns A promise that resolves when the transport has been connected.
   */
  async connect(transport: Transport) {
    await this.server.connect(transport)
  }

  /**
   * Instantiate the router of the application. The router is used to handle HTTP requests
   * and route them to the appropriate event handler. This function will collect all routes
   * from the registered modules and generate the event handlers for each route.
   *
   * @returns The router of the application.
   * @example mcp.createRouter()
   */
  @Once()
  createRouter() {
    const router = createRouter()

    // --- SSE transport.
    router.get('/sse', defineEventHandler(async(event) => {
      const transport = new SSEServerTransport('/messages', event.node.res)
      this.transports.set(transport.sessionId, transport)
      await this.server.connect(transport)
      event.node.res.on('close', () => {
        this.transports.delete(transport.sessionId)
        void transport.close()
      })
    }))

    // --- Messages.
    router.post('/messages', defineEventHandler(async(event) => {
      const { sessionId } = getQuery<{ sessionId?: string }>(event)
      if (!sessionId) throw new Error('Session ID is required')
      const transport = this.transports.get(sessionId)
      if (transport instanceof SSEServerTransport === false) throw new Error('SSE transport is not initialized')
      await transport.handlePostMessage(event.node.req, event.node.res)
    }))

    return router
  }

  /**
   * Instantiate the H3 application of the application with the router handler.
   *
   * @param options The options to pass to the application.
   * @returns The H3 application of the application.
   * @example mcp.createApp()
   */
  @Once()
  createApp(options?: AppOptions) {
    const router = this.createRouter()
    return createApp(options).use(router)
  }

  /**
   * Create a Node.js server with the application handler.
   *
   * @param options The options to pass to the application.
   * @returns The Node.js server with the application handler.
   * @example mcp.createServer()
   */
  @Once()
  createServer(options?: AppOptions) {
    const app = this.createApp(options)
    const listener = toNodeListener(app)
    return createServer(listener)
  }

  /**
   * Create an Stdio transport and connect it to the server.
   *
   * @param stdin The standard input stream.
   * @param stdout The standard output stream.
   * @returns The Stdio transport.
   * @example mcp.startStdio()
   */
  @Once()
  async startStdio(stdin: Readable = process.stdin, stdout: Writable = process.stdout): Promise<StdioServerTransport> {
    const transport = new StdioServerTransport(stdin, stdout)
    await this.server.connect(transport)
    return transport
  }
}

export function createMcp<T extends McpServerOptions>(options = {} as T) {
  return new MCP(options)
}
