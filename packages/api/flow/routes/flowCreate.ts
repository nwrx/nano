import type { ModuleFlow } from '..'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assertString, assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { randomName } from '../../utils'
import { ModuleWorkspace } from '../../workspace'

export function flowCreate(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'POST /api/flows',
      parseBody: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        name: [[assertUndefined], [assertStringNotEmpty, toSlug]],
        title: [[assertUndefined], [assertString]],
        description: [[assertUndefined], [assertString]],
      }),
    },
    async({ event, body }) => {
      const userModule = this.getModule(ModuleUser)
      const workspaceModule = this.getModule(ModuleWorkspace)
      const { user } = await userModule.authenticate(event)
      const {
        name = randomName(),
        title = name,
        description = '',
        workspace: workspaceName,
        project: projectName,
      } = body

      // --- Resolve the workspace and project and assert the user has access to them.
      const workspace = await workspaceModule.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
      const project = await workspaceModule.resolveProject({ user, workspace, name: projectName, permission: 'Write' })

      // --- Assert there is no flow with the same name.
      const { Flow } = this.getRepositories()
      const exists = await Flow.findOne({ where: { project, name } })
      if (exists) throw this.errors.FLOW_NAME_TAKEN(workspaceName, projectName, name)

      // --- Create and save the flow.
      const flow = Flow.create({ name, title, description, project, data: { version: '1' } })
      await Flow.save(flow)
      return flow.serialize()
    },
  )
}
