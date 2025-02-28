import { createError } from '@unserved/server'

export const ERRORS = {
  // Vault
  VAULT_NOT_FOUND: (name: string) => createError({
    name: 'E_VAULT_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `The vault with name "${name}" was not found`,
    data: { name },
  }),
  VAULT_ACTION_NOT_ALLOWED: (name: string) => createError({
    name: 'E_VAULT_ACTION_NOT_ALLOWED',
    statusCode: 403,
    statusMessage: 'Forbidden',
    message: `The action is not allowed on the vault with name "${name}"`,
    data: { name },
  }),
  VAULT_ALREADY_EXISTS: (name: string, workspace: string) => createError({
    name: 'E_VAULT_ALREADY_EXISTS',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `A vault with name "${name}" already exists in the workspace "${workspace}"`,
    data: { name },
  }),
  VAULT_NAME_INVALID: () => createError({
    name: 'E_VAULT_NAME_INVALID',
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: 'The vault name is invalid',
  }),

  // Assignments
  VAULT_ALREADY_ASSIGNED: (name: string, assignee: string) => createError({
    name: 'E_VAULT_ALREADY_ASSIGNED',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The vault "${name}" is already assigned to the user "${assignee}"`,
    data: { name, assignee },
  }),

  // Variables
  VAULT_VARIABLE_NOT_FOUND: (name: string, vault: string) => createError({
    name: 'E_VAULT_VARIABLE_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `The variable with name "${name}" was not found in the vault "${vault}"`,
    data: { name, vault },
  }),

  // Access Control
  VAULT_NOT_ACCESSIBLE: () => createError({
    name: 'E_VAULT_NOT_ACCESSIBLE',
    statusCode: 403,
    statusMessage: 'Forbidden',
    message: 'The vault is not accessible',
  }),
  VAULT_NOT_WRITABLE: () => createError({
    name: 'E_VAULT_NOT_WRITABLE',
    statusCode: 403,
    statusMessage: 'Forbidden',
    message: 'The vault is not writable',
  }),

  // Operations
  VAULT_UNABLE_TO_DELETE: () => createError({
    name: 'E_VAULT_UNABLE_TO_DELETE',
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: 'The vault cannot be deleted',
  }),
  VAULT_UNABLE_TO_UPDATE: () => createError({
    name: 'E_VAULT_UNABLE_TO_UPDATE',
    statusCode: 400,
    statusMessage: 'Bad Request',
    message: 'The vault cannot be updated',
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
