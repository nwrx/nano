import type { Loose } from '@unshared/types'
import type { FindOptionsOrder } from 'typeorm'
import type { ModuleMcpPool } from '..'
import type { McpPool } from '../entities'
import { assert, createParser } from '@unshared/validation'
import { ILike, In } from 'typeorm'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'

/** The parser function for the `searchMcpPools` function. */
export const SEARCH_MCP_POOLS_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  workspace: assertWorkspace,
  search: [[assert.undefined], [assert.string]],
  page: [[assert.undefined], [assert.number]],
  limit: [[assert.undefined], [assert.number]],
  order: [[assert.undefined], [assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<McpPool>]],
  withServers: [[assert.undefined], [assert.boolean]],
  withAssignments: [[assert.undefined], [assert.boolean]],
  withProjectAssignments: [[assert.undefined], [assert.boolean]],
})

/** The options to search for MCP pools. */
export type SearchMcpPoolsOptions = Loose<ReturnType<typeof SEARCH_MCP_POOLS_OPTIONS_SCHEMA>>

/**
 * Search for MCP pools within a workspace. The function will query the database
 * for MCP pools matching the search criteria and ensure proper access control.
 *
 * @param options The options to search MCP pools with.
 * @returns An array of MCP pools matching the search criteria.
 */
export async function searchMcpPools(this: ModuleMcpPool, options: SearchMcpPoolsOptions): Promise<McpPool[]> {
  const {
    search = '',
    user,
    workspace,
    page = 1,
    limit = 10,
    order = { name: 'ASC' },
    withServers = false,
    withAssignments = false,
    withProjectAssignments = false,
  } = SEARCH_MCP_POOLS_OPTIONS_SCHEMA(options)

  // --- Get the repositories to query the database.
  const { McpPool } = this.getRepositories()
  const searchSafe = search.replaceAll(/[^\d\sa-z]/gi, '')
  const searchOperator = searchSafe.length > 2 ? ILike(`%${searchSafe}%`) : undefined

  // --- Query and return the MCP pools
  return await McpPool.find({
    where: {
      workspace,
      name: searchOperator,
      assignments: { user, permission: In(['Owner', 'Read']) },
    },
    relations: {
      servers: withServers,
      assignments: withAssignments,
      projectAssignments: withProjectAssignments,
    },
    order,
    take: limit,
    skip: (page - 1) * limit,
  })
}
