import { createError } from '@unserved/server'

export const ERRORS = {
  WORKSPACE_NOT_FOUND: (workspace: string) => createError({
    name: 'E_WORKSPACE_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Workspace "${workspace}" not found`,
    data: { workspace },
  }),
  WORKSPACE_UNAUTHORIZED: (workspace: string) => createError({
    name: 'E_WORKSPACE_ACTION_NOT_AUTHORIZED',
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message: `Not authorized to perform the requested action on workspace "${workspace}"`,
    data: { workspace },
  }),
  WORKSPACE_NAME_TAKEN: (workspace: string) => createError({
    name: 'E_WORKSPACE_NAME_TAKEN',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The workspace name "${workspace}" is already taken or is a reserved keyword`,
    data: { workspace },
  }),
  WORKSPACE_ALREADY_ASSIGNED: (user: string, workspace: string, permission: string) => createError({
    name: 'E_WORKSPACE_ALREADY_ASSIGNED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `User "${user}" is already assigned to workspace "${workspace}" with permission "${permission}"`,
    data: { user, workspace },
  }),
}
