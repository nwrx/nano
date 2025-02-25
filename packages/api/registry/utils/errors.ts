/* eslint-disable sonarjs/no-nested-template-literals */
import { createError } from '@unserved/server'

export const ERRORS = {
  // Collection General
  REGISTRY_COLLECTION_NOT_FOUND: (workspace: string | undefined, collection: string) => createError({
    name: 'E_REGISTRY_COLLECTION_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Registry collection "${workspace ? `${workspace}/${collection}` : collection}" not found or user does not have access to the collection`,
    data: { workspace, collection },
  }),
  REGISTRY_COMPONENT_NOT_FOUND: (workspace: string, collection: string, component: string) => createError({
    name: 'E_REGISTRY_COMPONENT_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Registry component "${workspace}/${collection}/${component}" not found or user does not have access to the component`,
    data: { workspace, collection, component },
  }),

  // Collection Authorization
  REGISTRY_UNAUTHORIZED: (workspace: string, collection: string) => createError({
    name: 'E_REGISTRY_UNAUTHORIZED',
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message: `User is not authorized to perform this action on registry collection "${workspace}/${collection}"`,
    data: { workspace, collection },
  }),
  REGISTRY_FORBIDDEN: (workspace: string, collection: string) => createError({
    name: 'E_REGISTRY_FORBIDDEN',
    statusCode: 403,
    statusMessage: 'Forbidden',
    message: `User does not have access to registry collection "${workspace}/${collection}"`,
    data: { workspace, collection },
  }),

  // Collection Lifecycle
  REGISTRY_COLLECTION_NAME_TAKEN: (workspace: string, collection: string) => createError({
    name: 'E_REGISTRY_COLLECTION_NAME_TAKEN',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The registry collection name "${collection}" is already taken in workspace "${workspace}"`,
    data: { workspace, collection },
  }),
  REGISTRY_COMPONENT_NAME_TAKEN: (workspace: string, collection: string, component: string) => createError({
    name: 'E_REGISTRY_COMPONENT_NAME_TAKEN',
    statusCode: 409,
    statusMessage: 'Conflict',
    message: `The registry component name "${component}" is already taken in collection "${workspace}/${collection}"`,
    data: { workspace, collection, component },
  }),

  // Category General
  REGISTRY_CATEGORY_NOT_FOUND: (category: string) => createError({
    name: 'E_REGISTRY_CATEGORY_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Registry category "${category}" not found`,
    data: { category },
  }),
}
