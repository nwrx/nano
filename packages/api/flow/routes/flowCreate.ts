import type { ModuleFlow } from '..'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getRandomName } from '../utils'

export function flowCreate(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/projects/:project/flows',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        name: [[assertUndefined, getRandomName], [assertStringNotEmpty, toSlug]],
      }),
    },
    async({ event, parameters, body }) => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Resolve the workspace and project and assert the user has access to them.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await moduleProject.getProject({ name: parameters.project, workspace, user, permission: 'Write' })

      // --- Assert there is no flow with the same name.
      const { Flow, FlowAssignment } = this.getRepositories()
      const { name } = body
      const exists = await Flow.countBy({ project, name })
      if (exists) throw this.errors.FLOW_NAME_TAKEN(workspace.name, project.name, name)

      // --- Create the flow and it's assignment.
      const flow = Flow.create({ name, title: name, project })
      const assignment = FlowAssignment.create({ user, flow, permission: 'Owner' })
      flow.assignments = [assignment]

      // --- Save the flow and return the serialized flow.
      await Flow.save(flow)
      return flow.serialize()
    },
  )
}
