import type { ModuleFlow } from '..'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assertString, assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { getRandomName } from '../utils'

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
      const projectModule = this.getModule(ModuleProject)
      const { user } = await userModule.authenticate(event)
      const {
        name = getRandomName(),
        title = name,
        description = '',
        workspace,
        project: projectName,
      } = body

      // --- Resolve the workspace and project and assert the user has access to them.
      const project = await projectModule.getProject({
        user,
        workspace,
        name: projectName,
        permission: 'Write',
      })

      // --- Assert there is no flow with the same name.
      const { Flow } = this.getRepositories()
      const exists = await Flow.findOne({ where: { project, name } })
      if (exists) throw this.errors.FLOW_NAME_TAKEN(workspace, projectName, name)

      // --- Create and save the flow.
      const flow = Flow.create({
        name,
        version: 'draft',
        title,
        description,
        project,
        data: { version: '1' },
      })
      await Flow.save(flow)
      return flow.serialize()
    },
  )
}
