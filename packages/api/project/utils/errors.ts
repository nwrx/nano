import { createError } from '@unserved/server'

export const ERRORS = {
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

  // Secrets
  PROJECT_SECRET_ENCRYPTION_KEY_REQUIRED: () => createError({
    name: 'E_PROJECT_SECRET_ENCRYPTION_KEY_REQUIRED',
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    message: 'The secret key is required to encrypt the secret value',
  }),
  PROJECT_SECRET_ENCRYPTION_ALGORITHM_NOT_SUPPORTED: (algorithm: string) => createError({
    name: 'E_PROJECT_SECRET_ENCRYPTION_ALGORITHM_NOT_SUPPORTED',
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    message: `The encryption algorithm "${algorithm}" is not supported, only GCM algorithms are supported`,
    data: { algorithm },
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
}
