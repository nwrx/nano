import { createError } from '@unserved/server'

export const ERRORS = {
  MCP_POOL_NOT_FOUND: (workspace: string, name: string) => createError({
    name: 'E_MCP_POOL_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `The MCP pool "${workspace}/${name}" was not found`,
    data: { workspace, name },
  }),
  MCP_POOL_FORBIDDEN: (workspace: string, name: string) => createError({
    name: 'E_MCP_POOL_ACTION_NOT_ALLOWED',
    statusCode: 403,
    statusMessage: 'Forbidden',
    message: `The action is not allowed on the MCP pool "${workspace}/${name}"`,
    data: { workspace, name },
  }),
  MCP_POOL_NAME_TAKEN: (workspace: string, name: string) => createError({
    name: 'E_MCP_POOL_NAME_TAKEN',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The MCP pool name "${name}" is already taken in workspace "${workspace}"`,
    data: { workspace, name },
  }),
  MCP_POOL_ALREADY_EXISTS: (workspace: string, name: string) => createError({
    name: 'E_MCP_POOL_ALREADY_EXISTS',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The MCP pool "${workspace}/${name}" already exists`,
    data: { workspace, name },
  }),
  MCP_POOL_ALREADY_DEFAULT: (workspace: string, name: string) => createError({
    name: 'E_MCP_POOL_ALREADY_DEFAULT',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The MCP pool "${workspace}/${name}" is already the default pool`,
    data: { workspace, name },
  }),
  MCP_POOL_DEFAULT_CANNOT_DELETE: (workspace: string, name: string) => createError({
    name: 'E_MCP_POOL_DEFAULT_CANNOT_DELETE',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `Cannot delete the default MCP pool "${workspace}/${name}". Set another pool as default first.`,
    data: { workspace, name },
  }),
  MCP_POOL_HAS_SERVERS: (workspace: string, name: string) => createError({
    name: 'E_MCP_POOL_HAS_SERVERS',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `Cannot delete MCP pool "${workspace}/${name}" because it has active servers. Remove all servers first.`,
    data: { workspace, name },
  }),
  MCP_POOL_USER_ALREADY_ASSIGNED: (workspace: string, pool: string, assignee: string) => createError({
    name: 'E_MCP_POOL_USER_ALREADY_ASSIGNED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The MCP pool "${workspace}/${pool}" is already assigned to the user "${assignee}"`,
    data: { workspace, pool, assignee },
  }),
  MCP_POOL_PROJECT_ALREADY_ASSIGNED: (workspace: string, pool: string, project: string) => createError({
    name: 'E_MCP_POOL_PROJECT_ALREADY_ASSIGNED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The MCP pool "${workspace}/${pool}" is already assigned to the project "${project}"`,
    data: { workspace, pool, project },
  }),
  MCP_POOL_NO_MANAGER_ASSIGNED: (workspace: string, pool: string) => createError({
    name: 'E_MCP_POOL_NO_MANAGER_ASSIGNED',
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message: `The MCP pool "${workspace}/${pool}" has no manager assigned. Please assign a manager to the pool.`,
    data: { workspace, pool },
  }),
  MCP_POOL_NO_GATEWAY_ASSIGNED: (workspace: string, pool: string, manager: string) => createError({
    name: 'E_MCP_POOL_NO_GATEWAY_ASSIGNED',
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message: `The MCP pool "${workspace}/${pool}" has no gateway assigned for the manager "${manager}". Please assign a gateway to the manager.`,
    data: { workspace, pool, manager },
  }),

  MCP_POOL_MANAGER_RELATION_NOT_LOADED: (workspace: string, pool: string) => createError({
    name: 'E_MCP_POOL_MANAGER_RELATION_NOT_LOADED',
    statusCode: 503,
    statusMessage: 'Service Unavailable',
    message: `The MCP pool "${workspace}/${pool}" manager relation is not loaded. Please ensure the relation is loaded before accessing it.`,
    data: { workspace, pool },
  }),
}
