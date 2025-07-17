import type { McpError } from '@modelcontextprotocol/sdk/types.js'
import { createError } from '@unserved/server'

export const ERRORS = {

  // MCP Server
  MCP_SERVER_NOT_FOUND: (workspace: string, pool: string, name: string) => createError({
    name: 'E_MCP_SERVER_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `The MCP server "${workspace}/${pool}/${name}" was not found`,
    data: { workspace, pool, name },
  }),
  MCP_SERVER_FORBIDDEN: (pool: string, name: string) => createError({
    name: 'E_MCP_SERVER_ACTION_NOT_ALLOWED',
    statusCode: 403,
    statusMessage: 'Forbidden',
    message: `The action is not allowed on the MCP server "${pool}/${name}"`,
    data: { pool, name },
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

  // MCP Server Arguments
  MCP_SERVER_ARGUMENT_NOT_FOUND: (server: string, position: number) => createError({
    name: 'E_MCP_SERVER_ARGUMENT_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `The argument at position ${position} for MCP server "${server}" was not found`,
    data: { server, position },
  }),
  MCP_SERVER_ARGUMENT_POSITION_EXISTS: (server: string, position: number) => createError({
    name: 'E_MCP_SERVER_ARGUMENT_POSITION_EXISTS',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The MCP server "${server}" already has an argument at position ${position}`,
    data: { server, position },
  }),
  MCP_SERVER_ARGUMENT_INVALID_SOURCE: () => createError({
    name: 'E_MCP_SERVER_ARGUMENT_INVALID_SOURCE',
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: 'Either value or variable must be provided, but not both',
  }),

  // MCP Server Variables
  MCP_SERVER_VARIABLE_NOT_FOUND: (server: string, variable: string) => createError({
    name: 'E_MCP_SERVER_VARIABLE_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `The variable assignment "${variable}" for MCP server "${server}" was not found`,
    data: { server, variable },
  }),
  MCP_SERVER_VARIABLE_ALREADY_EXISTS: (server: string, name: string) => createError({
    name: 'E_MCP_SERVER_VARIABLE_ALREADY_EXISTS',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The MCP server "${server}" already has access to variable "${name}"`,
    data: { server, name },
  }),
  MCP_SERVER_VARIABLE_INVALID_SOURCE: () => createError({
    name: 'E_MCP_SERVER_VARIABLE_INVALID_SOURCE',
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: 'Either value or variable must be provided, but not both',
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
}
