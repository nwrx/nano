import type { Loose } from '@unshared/types'
import type { McpManager } from '../entities'
import type { ModuleMcpManager } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ILike } from 'typeorm'
import { assertUser, ModuleUser } from '../../user'

const SEARCH_MANAGER_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  search: [[assert.undefined], [assert.stringNotEmpty]],
  page: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
  limit: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
  order: [[assert.undefined], [assert.stringNotEmpty, assert.objectStrict]],
  withDeleted: [[assert.undefined], [assert.boolean]],
  withGateways: [[assert.undefined], [assert.boolean]],
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withDisabledBy: [[assert.undefined], [assert.boolean]],
})

/** The options to search for MCP managers. */
type SearchManagerOptions = Loose<ReturnType<typeof SEARCH_MANAGER_OPTIONS_SCHEMA>>

/**
 * Search for MCP managers based on the provided query parameters.
 * This operation requires super administrator privileges.
 *
 * @param options The options containing search parameters, user, and pagination details.
 * @returns An array of MCP manager objects that match the search criteria.
 */
export async function searchManager(this: ModuleMcpManager, options: SearchManagerOptions): Promise<McpManager[]> {
  const {
    user,
    search = '',
    page = 1,
    limit = 10,
    order = { createdAt: 'DESC' },
    withDeleted = false,
    withGateways = false,
    withCreatedBy = false,
    withUpdatedBy = false,
    withDisabledBy = false,
  } = SEARCH_MANAGER_OPTIONS_SCHEMA(options)

  // --- Assert that the user is a super administrator.
  const moduleUser = this.getModule(ModuleUser)
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

  // --- Search for MCP managers with the provided query parameters.
  const { McpManager } = this.getRepositories()
  const searchSafe = search.replaceAll(/[^\d\sa-z]/gi, '')
  const searchOperator = searchSafe.length > 2 ? ILike(`%${searchSafe}%`) : undefined

  // --- Query with pagination and ordering.
  return await McpManager.find({
    where: [
      { identity: searchOperator },
      { address: searchOperator },
    ],
    order,
    skip: (page - 1) * limit,
    take: limit,
    withDeleted,
    relations: {
      gateways: withGateways,
      createdBy: withCreatedBy,
      updatedBy: withUpdatedBy,
      disabledBy: withDisabledBy,
      deletedBy: withDeleted,
    },
  })
}
