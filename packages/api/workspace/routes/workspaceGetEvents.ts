import type { ModuleWorkspace } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getWorkspaceEventBus } from '../utils'

export function workspaceGetEvents(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/events',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event, { optional: true })
      const workspace = await this.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const eventBus = getWorkspaceEventBus.call(this, { workspace, createIfNotExists: true })!
      return eventBus.subscribe(event)
    },
  )
}
