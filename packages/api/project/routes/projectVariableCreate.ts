import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringConstantCase, assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getProject } from '../utils'

export function projectVariableCreate(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/:project/variables',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        name: assertStringConstantCase,
        value: assertStringNotEmpty,
      }),
    },
    async({ event, body, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project: projectName } = parameters
      const { name, value } = body

      // --- Generate a new variable for the project.
      const { ProjectVariable } = this.getRepositories()
      const project = await getProject.call(this, { user, workspace, name: projectName, permission: 'WriteVariables' })
      const variable = ProjectVariable.create({ project, name, value, createdBy: user })
      await ProjectVariable.save(variable)
    },
  )
}
