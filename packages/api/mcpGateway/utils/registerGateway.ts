import type { Loose } from '@unshared/types'
import type { ModuleMcpGateway } from '../index'
import { toSlug } from '@unshared/string/toSlug'
import { assert, createParser } from '@unshared/validation'
import { assertMcpManager } from '../../mcpManager/utils/assertMcpManager'
import { assertUser, ModuleUser } from '../../user'
import { createGatewayClient } from './createGatewayClient'

/** The schema for the register gateway options. */
export const REGISTER_GATEWAY_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  manager: assertMcpManager,
  address: assert.stringNotEmpty,
  identity: [[assert.undefined], [assert.stringNotEmpty, toSlug]],
})

/** The options for the register gateway. */
export type RegisterGatewayOptions = Loose<ReturnType<typeof REGISTER_GATEWAY_OPTIONS_SCHEMA>>

/**
 * Register a new MCP gateway. This will create a new gateway
 * in the database and immediately claim it. This will also instantiate a new
 * gateway client that can be used to interact with the gateway.
 *
 * @param options The options to register the gateway.
 * @returns The newly created `McpGateway` entity.
 * @example await registerGateway({ user, address: 'http://localhost:3000' })
 */
export async function registerGateway(this: ModuleMcpGateway, options: RegisterGatewayOptions) {
  const { user, manager, address, identity = toSlug(address) } = options

  // --- Assert that the user is a super administrator.
  const moduleUser = this.getModule(ModuleUser)
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

  // --- Check if a gateway with the same address already exists
  const { McpGateway } = this.getRepositories()
  const exists = await McpGateway.countBy({ address })
  if (exists > 0) throw this.errors.MCP_GATEWAY_ALREADY_REGISTERED(address)

  // --- Create the database record.
  const gateway = McpGateway.create({
    address,
    identity,
    createdBy: user,
    lastSeenAt: new Date(),
    manager,
  })

  // --- Instantiate a client and check if the gateway is reachable.
  const client = createGatewayClient(gateway)
  const status = await client.getStatus()
  if (!status) throw this.errors.MCP_GATEWAY_NOT_REACHABLE(address)

  // --- Store the manager client in the managers map.
  this.gateways.set(gateway.id, client)
  return await McpGateway.save(gateway)
}
