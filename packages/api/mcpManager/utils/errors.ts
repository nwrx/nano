import { createError } from '@unserved/server'

export const ERRORS = {
  MCP_MANAGER_NOT_FOUND: (identity: string) => createError({
    name: 'E_MCP_MANAGER_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `MCP manager with identity "${identity}" was not found`,
    data: { identity },
  }),
  MCP_MANAGER_ALREADY_REGISTERED: (address: string) => createError({
    name: 'E_MCP_MANAGER_ALREADY_REGISTERED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `MCP manager with address "${address}" is already registered`,
    data: { address },
  }),
  MCP_MANAGER_NOT_REACHABLE: (address: string, message?: string) => createError({
    name: 'E_MCP_MANAGER_NOT_REACHABLE',
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message: `MCP manager with address "${address}" is not reachable: ${message}`,
    data: { address, message },
  }),
  MCP_MANAGER_NO_ELIGIBLE_MANAGER: () => createError({
    name: 'E_MCP_MANAGER_NO_ELIGIBLE_MANAGER',
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message: 'No eligible MCP manager found',
  }),
  MCP_MANAGER_ALREADY_DISABLED: (identity: string) => createError({
    name: 'E_MCP_MANAGER_ALREADY_DISABLED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `MCP manager with identity "${identity}" is already disabled`,
    data: { identity },
  }),
  MCP_MANAGER_ALREADY_ENABLED: (identity: string) => createError({
    name: 'E_MCP_MANAGER_ALREADY_ENABLED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `MCP manager with identity "${identity}" is already enabled`,
    data: { identity },
  }),
}
