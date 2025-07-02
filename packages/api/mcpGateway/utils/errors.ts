import { createError } from '@unserved/server'

export const ERRORS = {
  MCP_GATEWAY_NOT_FOUND: (manager: string, identity: string) => createError({
    name: 'E_MCP_GATEWAY_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `MCP gateway with identity "${manager}/${identity}" was not found`,
    data: { manager, identity },
  }),
  MCP_GATEWAY_ALREADY_REGISTERED: (address: string) => createError({
    name: 'E_MCP_GATEWAY_ALREADY_REGISTERED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `MCP gateway with address "${address}" is already registered`,
    data: { address },
  }),
  MCP_GATEWAY_NOT_REACHABLE: (address: string, message?: string) => createError({
    name: 'E_MCP_GATEWAY_NOT_REACHABLE',
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message: `MCP gateway with address "${address}" is not reachable: ${message}`,
    data: { address, message },
  }),
  MCP_GATEWAY_ALREADY_DISABLED: (manager: string, identity: string) => createError({
    name: 'E_MCP_GATEWAY_ALREADY_DISABLED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `MCP gateway with identity "${manager}/${identity}" is already disabled`,
    data: { manager, identity },
  }),
  MCP_GATEWAY_ALREADY_ENABLED: (manager: string, identity: string) => createError({
    name: 'E_MCP_GATEWAY_ALREADY_ENABLED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `MCP gateway with identity "${manager}/${identity}" is already enabled`,
    data: { manager, identity },
  }),
}
