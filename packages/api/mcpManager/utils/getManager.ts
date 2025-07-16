import type { Loose } from '@unshared/types'
import type { McpManager } from '../entities'
import type { ModuleMcpManager } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { assertUser } from '../../user/utils'

/** The schema for the getMcpManager options. */
const GET_MANAGER_OPTIONS_SCHEMA = createParser({
  user: [assert.object, assertUser],
  identity: assert.stringNotEmpty,
  withDeleted: [[assert.undefined], [assert.boolean]],
  withGateways: [[assert.undefined], [assert.boolean]],
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withDisabledBy: [[assert.undefined], [assert.boolean]],
})

/** The options to get an MCP manager by ID. */
type GetManagerOptions = Loose<ReturnType<typeof GET_MANAGER_OPTIONS_SCHEMA>>

/**
 * Get a manager by its ID. This will return the manager that is
 * associated with the given ID. If no manager is found, this will throw
 * an error. This operation requires super administrator privileges.
 *
 * @param options The options containing identity, user, and manager ID.
 * @returns The manager associated with the given ID.
 * @example moduleMcpManager.getManager({ identity: 'manager-id', user, withGateways: true })
 */
export async function getManager(this: ModuleMcpManager, options: GetManagerOptions): Promise<McpManager> {
  const {
    user,
    identity,
    withDeleted = false,
    withGateways = false,
    withCreatedBy = false,
    withUpdatedBy = false,
    withDisabledBy = false,
  } = GET_MANAGER_OPTIONS_SCHEMA(options)

  // --- Assert that the user is a super administrator.
  const moduleUser = this.getModule(ModuleUser)
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

  // --- Get the manager by ID.
  const { McpManager } = this.getRepositories()
  const manager = await McpManager.findOne({
    where: { identity },
    withDeleted,
    relations: {
      gateways: withGateways,
      createdBy: withCreatedBy,
      updatedBy: withUpdatedBy,
      disabledBy: withDisabledBy,
      deletedBy: withDeleted,
    },
  })

  // --- If no manager is found, throw an error.
  if (!manager) throw this.errors.MCP_MANAGER_NOT_FOUND(identity)
  return manager
}
