import { createError } from '@unserved/server'

export const ERRORS = {

  // General
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
  PROJECT_FORBIDDEN: (workspace: string, project: string) => createError({
    name: 'E_PROJECT_FORBIDDEN',
    statusCode: 403,
    statusMessage: 'Forbidden',
    message: `User does not have access to project "${workspace}/${project}"`,
    data: { workspace, project },
  }),

  // Lifecycle
  PROJECT_NAME_TAKEN: (workspace: string, project: string) => createError({
    name: 'E_PROJECT_NAME_TAKEN',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The project name "${project}" is already taken in workspace "${workspace}"`,
    data: { workspace, project },
  }),
}
