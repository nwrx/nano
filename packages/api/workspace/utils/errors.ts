import { createError } from '@unserved/server'

export const ERRORS = {

  // Project
  PROJECT_NOT_FOUND: (workspace: string, project: string) => createError({
    name: 'E_PROJECT_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Project "${workspace}/${project}" not found or user does not have access to the project`,
    data: { workspace, project },
  }),
  PROJECT_UNAUTHORIZED: (workspace: string, project: string) => createError({
    name: 'E_PROJECT_UNAUTHORIZED',
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message: `User is not authorized to perform this action on project "${workspace}/${project}"`,
    data: { workspace, project },
  }),
  PROJECT_NAME_TAKEN: (workspace: string, project: string) => createError({
    name: 'E_PROJECT_NAME_TAKEN',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The project name "${project}" is already taken in workspace "${workspace}"`,
    data: { workspace, project },
  }),
  PROJECT_VARIABLE_NAME_TAKEN: (workspace: string, project: string, variable: string) => createError({
    name: 'E_PROJECT_VARIABLE_NAME_TAKEN',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The variable name "${variable}" is already taken in project "${workspace}/${project}"`,
    data: { workspace, project, variable },
  }),
  PROJECT_VARIABLE_NOT_FOUND: (workspace: string, project: string, variable: string) => createError({
    name: 'E_PROJECT_VARIABLE_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Variable "${variable}" not found in project "${workspace}/${project}"`,
    data: { workspace, project, variable },
  }),
  PROJECT_SECRET_NAME_TAKEN: (workspace: string, project: string, secret: string) => createError({
    name: 'E_PROJECT_SECRET_NAME_TAKEN',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The secret name "${secret}" is already taken in project "${workspace}/${project}"`,
    data: { workspace, project, secret },
  }),
  PROJECT_SECRET_NOT_FOUND: (workspace: string, project: string, secret: string) => createError({
    name: 'E_PROJECT_SECRET_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Secret "${secret}" not found in project "${workspace}/${project}"`,
    data: { workspace, project, secret },
  }),

  // Workspace
  WORKSPACE_NOT_FOUND: (workspace: string) => createError({
    name: 'E_WORKSPACE_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Workspace "${workspace}" not found or user does not have access to the workspace`,
    data: { workspace },
  }),
  WORKSPACE_ACTION_NOT_AUTHORIZED: (workspace: string) => createError({
    name: 'E_WORKSPACE_ACTION_NOT_AUTHORIZED',
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message: `Workspace "${workspace}" not found or action on this workspace is not authorized`,
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
