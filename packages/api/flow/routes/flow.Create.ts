import type { ModuleFlow } from '..'
import { createRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assertString, assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { randomName } from '../../utils'
import { ModuleWorkspace } from '../../workspace'

export function flowCreate(this: ModuleFlow) {
  return createRoute(
    {
      name: 'POST /api/workspaces/:workspace/:project',
      parameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
      }),
      body: createSchema({
        name: [[assertUndefined], [assertStringNotEmpty, toSlug]],
        title: [[assertUndefined], [assertString]],
        description: [[assertUndefined], [assertString]],
      }),
    },
    async({ event, body, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const workspaceModule = this.getModule(ModuleWorkspace)
      const { user } = await userModule.authenticate(event)
      const { name = randomName(), title = name, description } = body
      const { workspace: workspaceName, project: projectName } = parameters

      // --- Resolve the workspace and project and assert the user has access to them.
      const workspace = await workspaceModule.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
      const project = await workspaceModule.resolveProject({ user, workspace, name: projectName, permission: 'Write' })

      // --- Create and save the flow.
      const { Flow } = this.getRepositories()
      const flow = Flow.create({ name, title, description, project, data: { version: '1' } })
      await Flow.save(flow)
      return flow.serialize()
    },
  )
}
