import type { Loose } from '@unshared/types'
import type { McpGateway } from '../entities'
import type { ModuleMcpGateway } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertMcpManager } from '../../mcpManager'
import { assertUser, ModuleUser } from '../../user'

/** The schema for the getMcpGateway options. */
const GET_GATEWAY_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  manager: assertMcpManager,
  identity: assert.stringNotEmpty,
  withDeleted: [[assert.undefined], [assert.boolean]],
  withManager: [[assert.undefined], [assert.boolean]],
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withDisabledBy: [[assert.undefined], [assert.boolean]],
})

/** The options to get an MCP gateway by ID. */
export type GetGatewayOptions = Loose<ReturnType<typeof GET_GATEWAY_OPTIONS_SCHEMA>>

/**
 * Get a gateway by its ID. This will return the gateway that is
 * associated with the given ID. If no gateway is found, this will throw
 * an error. This operation requires super administrator privileges.
 *
 * @param options The options containing identity, user, and gateway ID.
 * @returns The gateway associated with the given ID.
 * @example getMcpGateway.call(this, { identity: 'client-id', user, id: 'gateway-id' })
 */
export async function getGateway(this: ModuleMcpGateway, options: GetGatewayOptions): Promise<McpGateway> {
  const {
    user,
    manager,
    identity,
    withDeleted = false,
    withManager = false,
    withCreatedBy = false,
    withUpdatedBy = false,
    withDisabledBy = false,
  } = GET_GATEWAY_OPTIONS_SCHEMA(options)

  // --- Assert that the user is a super administrator.
  const moduleUser = this.getModule(ModuleUser)
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

  // --- Get the gateway by identity.
  const { McpGateway } = this.getRepositories()
  const gateway = await McpGateway.findOne({
    where: { identity, manager: { id: manager.id } },
    withDeleted,
    relations: {
      manager: withManager,
      createdBy: withCreatedBy,
      updatedBy: withUpdatedBy,
      disabledBy: withDisabledBy,
      deletedBy: withDeleted,
    },
  })

  // --- If no gateway is found, throw an error.
  if (!gateway) throw this.errors.MCP_GATEWAY_NOT_FOUND(manager.identity, identity)
  return gateway
}
