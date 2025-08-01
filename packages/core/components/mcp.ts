import type { Tool } from '../utils/toolSchema'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'
import { defineComponent } from '../utils/defineComponent'
import { TOOL_SCHEMA } from '../utils/toolSchema'

export const mcp = defineComponent(
  {
    isTrusted: true,
    isToolSet: true,
    name: 'mcp',
    purpose: 'integration',
    icon: 'carbon:web-services-container',
    title: {
      en: 'MCP',
      fr: 'MCP',
      de: 'MCP',
      es: 'MCP',
      zh: 'MCP',
    },
    description: {
      en: 'Connect to Model Context Protocol servers to access external tools and capabilities.',
      fr: 'Se connecter aux serveurs Model Context Protocol pour accéder aux outils et capacités externes.',
      de: 'Verbindung zu Model Context Protocol-Servern für den Zugriff auf externe Tools und Funktionen.',
      es: 'Conectar a servidores Model Context Protocol para acceder a herramientas y capacidades externas.',
      zh: '连接到模型上下文协议服务器以访问外部工具和功能。',
    },
    inputs: {
      endpoint: {
        'title': 'Endpoint',
        'description': 'The endpoint to send the request to.',
        'type': 'string',
        'x-control': 'text',
      },
    },
    outputs: {
      tools: {
        title: 'Tools',
        description: 'The tools available at the endpoint.',
        type: 'array',
        items: TOOL_SCHEMA,
      },
    },
  },
  async({ data, nodeId, thread }) => {
    const { endpoint } = data

    // --- Instantiate the MCP client and SSE transport.
    const client = new Client({ name: 'nano', version: '0.0.1' })
    const transport = new SSEClientTransport(new URL(endpoint))

    // --- Drop the connection when the thread is closed or an error occurs.
    thread.on('done', () => client.close())
    thread.on('error', () => client.close())

    // --- Connect to the transport and list the tools.
    await client.connect(transport, { signal: thread.abortController.signal })
    const toolsList = await client.listTools()
    const tools = toolsList.tools.map<Tool>(tool => ({
      nodeId,
      name: tool.name,
      description: tool.description,
      call: data => client.callTool({
        name: tool.name,
        arguments: data,
      }),
      inputSchema: {
        type: 'object',
        required: tool.inputSchema.required ?? [],
        properties: tool.inputSchema.properties ?? {},
      } as Tool['inputSchema'],
    }))

    return { tools }
  },
)
