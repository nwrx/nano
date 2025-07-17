import type { Loose } from '@unshared/types'
import type { FindOptionsOrder } from 'typeorm'
import type { McpServerVariable } from '../entities'
import type { ModuleMcpServerVariable } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ILike, IsNull } from 'typeorm'
import { assertMcpServer } from '../../mcpServer/utils/assertMcpServer'

/** The parser function for the `searchMcpServerVariables` function. */
const SEARCH_SERVER_VARIABLES_OPTIONS_SCHEMA = createParser({
  server: assertMcpServer,
  search: [[assert.undefined], [assert.string]],
  page: [[assert.undefined], [assert.number]],
  limit: [[assert.undefined], [assert.number]],
  order: [[assert.undefined], [assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<McpServerVariable>]],
  withServer: [[assert.undefined], [assert.boolean]],
  withVault: [[assert.undefined], [assert.boolean]],
  withVariable: [[assert.undefined], [assert.boolean]],
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withDeleted: [[assert.undefined], [assert.boolean]],
})

/** The options to search for MCP server variables. */
type SearchServerVariablesOptions = Loose<ReturnType<typeof SEARCH_SERVER_VARIABLES_OPTIONS_SCHEMA>>

/**
 * Search for MCP server variables within a workspace. The function will query the database
 * for MCP server variables matching the search criteria and ensure proper access control.
 *
 * @param options The options to search MCP server variables with.
 * @returns An array of MCP server variables matching the search criteria.
 */
export async function searchServerVariables(this: ModuleMcpServerVariable, options: SearchServerVariablesOptions): Promise<McpServerVariable[]> {
  const {
    server,
    search = '',
    page = 1,
    limit = 10,
    order = { name: 'ASC' },
    withServer = false,
    withVault = false,
    withVariable = false,
    withCreatedBy = false,
    withUpdatedBy = false,
    withDeleted = false,
  } = SEARCH_SERVER_VARIABLES_OPTIONS_SCHEMA(options)

  // --- Get the repositories to query the database.
  const { McpServerVariable } = this.getRepositories()
  const searchSafe = search.replaceAll(/[^\d\sa-z]/gi, '')
  const searchOperator = searchSafe.length > 2 ? ILike(`%${searchSafe}%`) : undefined

  // --- Query and return the MCP server variables
  return await McpServerVariable.find({
    where: {
      server: { id: server.id },
      name: searchOperator,
      deletedAt: withDeleted ? undefined : IsNull(),
    },
    relations: {
      server: withServer ? { pool: true } : false,
      variable: withVariable ? { vault: withVault } : false,
      createdBy: withCreatedBy,
      updatedBy: withUpdatedBy,
    },
    order,
    take: limit,
    skip: (page - 1) * limit,
  })
}
