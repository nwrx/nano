import type { McpError } from '@modelcontextprotocol/sdk/types.js'
import { createError } from '@unserved/server'

export const ERRORS = {
  MCP_SERVER_NOT_FOUND: (workspace: string, pool: string, name: string) => createError({
    name: 'E_MCP_SERVER_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `The MCP server "${workspace}/${pool}/${name}" was not found`,
    data: { workspace, pool, name },
  }),
  MCP_SERVER_ALREADY_EXISTS: (pool: string, name: string) => createError({
    name: 'E_MCP_SERVER_ALREADY_EXISTS',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The MCP server "${pool}/${name}" already exists`,
    data: { pool, name },
  }),
  MCP_SERVER_ALREADY_RUNNING: (pool: string, name: string) => createError({
    name: 'E_MCP_SERVER_ALREADY_RUNNING',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The MCP server "${pool}/${name}" is already running`,
    data: { pool, name },
  }),
  MCP_SERVER_ALREADY_STOPPED: (pool: string, name: string) => createError({
    name: 'E_MCP_SERVER_ALREADY_STOPPED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The MCP server "${pool}/${name}" is already stopped`,
    data: { pool, name },
  }),
  MCP_SERVER_NAME_TAKEN: (workspace: string, pool: string, name: string) => createError({
    name: 'E_MCP_SERVER_NAME_TAKEN',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The MCP server name "${name}" is already taken in pool "${workspace}/${pool}"`,
    data: { workspace, pool, name },
  }),

  // Runtime Errors
  MCP_SERVER_CONNECTION_FAILED: (error: McpError) => createError({
    name: 'E_MCP_SERVER_CONNECTION_FAILED',
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message: `Failed to connect to MCP server: ${error.message}`,
    data: {
      code: error.code,
      data: error.data,
      message: error.message,
    },
  }),
  MCP_SERVER_REQUEST_ERROR: (error: McpError) => {
    let statusCode: 400 | 404 | 500 = 500
    let statusMessage = 'Internal Server Error'
    if (error.code === -32002) [statusMessage, statusCode] = ['Resource Not Found', 404]
    else if (error.code === -32600) [statusMessage, statusCode] = ['Invalid Request', 400]
    else if (error.code === -32601) [statusMessage, statusCode] = ['Method Not Found', 404]
    else if (error.code === -32602) [statusMessage, statusCode] = ['Invalid Parameters', 400]
    else if (error.code === -32603) [statusMessage, statusCode] = ['Internal Error', 500]
    else if (error.code === -32700) [statusMessage, statusCode] = ['Parse Error', 400]
    return createError({
      name: 'E_MCP_SERVER_REQUEST_ERROR',
      statusCode,
      statusMessage,
      message: error.message,
      data: { code: error.code, data: error.data },
    })
  },
}
