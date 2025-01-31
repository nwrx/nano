import { createError } from '@unserved/server'

export const ERRORS = {

  // Flow
  FLOW_NOT_FOUND: (workspace: string, project: string, name: string) => createError({
    name: 'E_FLOW_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Flow "${workspace}/${project}/${name}" was not found in the database or the user does not have access to it`,
    data: { workspace, project, name },
  }),
  FLOW_NAME_TAKEN: (workspace: string, project: string, name: string) => createError({
    name: 'E_FLOW_NAME_TAKEN',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `Flow "${name}" already exists in the "${workspace}/${project}" project`,
  }),
  FLOW_IMPORT_FAILED: (response: Response) => createError({
    name: 'E_FLOW_IMPORT_FAILED',
    message: response.statusText,
    statusMessage: response.statusText,
    statusCode: response.status,
  }),

  // Module
  FLOW_MODULE_NOT_FOUND: (idOrSlug: string) => createError({
    name: 'E_FLOW_MODULE_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Module "${idOrSlug}" was not found in the database`,
  }),
}
