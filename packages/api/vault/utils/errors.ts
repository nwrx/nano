import { createError } from '@unserved/server'

export const ERRORS = {
  // Vault
  VAULT_NOT_FOUND: (workspace: string, name: string) => createError({
    name: 'E_VAULT_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `The vault "${workspace}/${name}" was not found`,
    data: { workspace, name },
  }),
  VAULT_FORBIDDEN: (workspace: string, name: string) => createError({
    name: 'E_VAULT_ACTION_NOT_ALLOWED',
    statusCode: 403,
    statusMessage: 'Forbidden',
    message: `The action is not allowed on the vault "${workspace}/${name}"`,
    data: { workspace, name },
  }),
  VAULT_ALREADY_EXISTS: (workspace: string, name: string) => createError({
    name: 'E_VAULT_ALREADY_EXISTS',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The vault "${workspace}/${name}" already exists`,
    data: { workspace, name },
  }),
  VAULT_ALREADY_DEFAULT: (workspace: string, name: string) => createError({
    name: 'E_VAULT_ALREADY_DEFAULT',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The vault "${workspace}/${name}" is already the default vault`,
    data: { workspace, name },
  }),
  VAULT_ALREADY_ENABLED: (workspace: string, name: string) => createError({
    name: 'E_VAULT_ALREADY_ENABLED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The vault "${workspace}/${name}" is already enabled`,
    data: { workspace, name },
  }),
  VAULT_ALREADY_DISABLED: (workspace: string, name: string) => createError({
    name: 'E_VAULT_ALREADY_DISABLED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The vault "${workspace}/${name}" is already disabled`,
    data: { workspace, name },
  }),

  // Assignments
  VAULT_ALREADY_ASSIGNED: (workspace: string, name: string, assignee: string) => createError({
    name: 'E_VAULT_ALREADY_ASSIGNED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The vault "${workspace}/${name}" is already assigned to the user "${assignee}"`,
    data: { workspace, name, assignee },
  }),

  // Variables
  VAULT_VARIABLE_NOT_FOUND: (workspace: string, name: string, variable: string) => createError({
    name: 'E_VAULT_VARIABLE_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `The variable "${variable}" in the vault "${workspace}/${name}" was not found`,
    data: { workspace, name, variable },
  }),

  // Vault Adapter
  VAULT_ADAPTER_NOT_IMPLEMENTED: (type: string) => createError({
    name: 'E_VAULT_ADAPTER_NOT_IMPLEMENTED',
    statusCode: 501,
    statusMessage: 'Not Implemented',
    message: `The vault adapter for the vault type "${type}" is not implemented`,
    data: { type },
  }),

  // Local adapter
  VAULT_ADAPTER_LOCAL_ENCRYPTION_ALGORITHM_NOT_SUPPORTED: (algorithm: string) => createError({
    name: 'E_VAULT_ADAPTER_LOCAL_ENCRYPTION_ALGORITHM_NOT_SUPPORTED',
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: `The encryption algorithm "${algorithm}" is not supported`,
    data: { algorithm },
  }),
  VAULT_ADAPTER_LOCAL_ENCRYPTION_KEY_REQUIRED: () => createError({
    name: 'E_VAULT_ADAPTER_LOCAL_ENCRYPTION_KEY_REQUIRED',
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: 'The encryption key is required',
  }),
}
