import type { Loose } from '@unshared/types'
import type { ModuleMcpManager } from '../index'
import { toSlug } from '@unshared/string/toSlug'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { assertUser } from '../../user/utils/assertUser'
import { createManagerClient } from './createManagerClient'

/** The schema for the register manager options. */
const REGISTER_MANAGER_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  address: assert.stringNotEmpty,
  identity: [[assert.undefined], [assert.stringNotEmpty, toSlug]],
})

/** The options for the register manager. */
type RegisterManagerOptions = Loose<ReturnType<typeof REGISTER_MANAGER_OPTIONS_SCHEMA>>

/**
 * Register a new MCP manager. This will create a new manager
 * in the database and immediately claim it. This will also instantiate a new
 * manager client that can be used to interact with the manager.
 *
 * @param options The options to register the manager.
 * @returns The newly created `McpManager` entity.
 * @example await registerManager({ user, address: 'http://localhost:3000' })
 */
export async function registerManager(this: ModuleMcpManager, options: RegisterManagerOptions) {
  const { user, address, identity = toSlug(address) } = REGISTER_MANAGER_OPTIONS_SCHEMA(options)

  // --- Assert that the user is a super administrator.
  const moduleUser = this.getModule(ModuleUser)
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

  // --- Check if a manager with the same address already exists
  const { McpManager } = this.getRepositories()
  const exists = await McpManager.countBy({ address })
  if (exists > 0) throw this.errors.MCP_MANAGER_ALREADY_REGISTERED(address)

  // --- Create the database record.
  const manager = McpManager.create({
    address,
    identity,
    createdBy: user,
    lastSeenAt: new Date(),
  })

  // --- Register, claim, and store the manager.
  const client = createManagerClient(manager)
  const status = await client.getStatus()
  if (!status) throw this.errors.MCP_MANAGER_NOT_REACHABLE(address)

  // --- Store the manager client in the managers map.
  this.managers.set(manager.id, client)
  return await McpManager.save(manager)
}
