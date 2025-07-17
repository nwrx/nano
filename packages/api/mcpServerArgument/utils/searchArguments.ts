import type { Loose } from '@unshared/types'
import type { FindOptionsOrder } from 'typeorm'
import type { McpServerArgument } from '../entities'
import type { ModuleMcpServerArgument } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ILike } from 'typeorm'
import { assertMcpServer } from '../../mcpServer/utils/assertMcpServer'

/** The parser function for the `searchMcpServerArguments` function. */
const SEARCH_ARGUMENTS_OPTIONS_SCHEMA = createParser({
  server: assertMcpServer,
  search: [[assert.undefined], [assert.string]],
  page: [[assert.undefined], [assert.number]],
  limit: [[assert.undefined], [assert.number]],
  order: [[assert.undefined], [assert.objectStrict as (value: unknown) => asserts value is FindOptionsOrder<McpServerArgument>]],
  withPool: [[assert.undefined], [assert.boolean]],
  withServer: [[assert.undefined], [assert.boolean]],
  withVault: [[assert.undefined], [assert.boolean]],
  withVariable: [[assert.undefined], [assert.boolean]],
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withDeleted: [[assert.undefined], [assert.boolean]],
})

/** The options to search for MCP server arguments. */
type SearchArgumentsOptions = Loose<ReturnType<typeof SEARCH_ARGUMENTS_OPTIONS_SCHEMA>>

/**
 * Search for MCP server arguments within a workspace. The function will query the database
 * for MCP server arguments matching the search criteria and ensure proper access control.
 *
 * @param options The options to search MCP server arguments with.
 * @returns An array of MCP server arguments matching the search criteria.
 */
export async function searchArguments(
  this: ModuleMcpServerArgument,
  options: SearchArgumentsOptions,
): Promise<McpServerArgument[]> {
  const {
    server,
    search = '',
    page = 1,
    limit = 10,
    order = { position: 'ASC' },
    withPool = false,
    withServer = false,
    withVault = false,
    withVariable = false,
    withCreatedBy = false,
    withUpdatedBy = false,
    withDeleted = false,
  } = SEARCH_ARGUMENTS_OPTIONS_SCHEMA(options)

  // --- Get the repositories to query the database.
  const { McpServerArgument } = this.getRepositories()
  const searchSafe = search.replaceAll(/[^\d\sa-z]/gi, '')
  const searchOperator = searchSafe.length > 2 ? ILike(`%${searchSafe}%`) : undefined

  // --- Query and return the MCP server arguments
  return await McpServerArgument.find({
    where: [
      { server: { id: server.id }, value: searchOperator },
      { server: { id: server.id }, variable: { name: searchOperator } },
    ],
    order,
    take: limit,
    skip: (page - 1) * limit,
    withDeleted,
    relations: {
      server: withServer ? { pool: withPool } : false,
      variable: withVariable ? { vault: withVault } : false,
      createdBy: withCreatedBy,
      updatedBy: withUpdatedBy,
    },
  })
}
