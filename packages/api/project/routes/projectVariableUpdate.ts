import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringConstantCase, assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getProject } from '../utils'

export function projectVariableUpdate(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/:project/variables/:name',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        name: assertStringConstantCase,
      }),
      parseBody: createSchema({
        value: assertStringNotEmpty,
      }),
    },
    async({ event, body, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project: projectName, name } = parameters
      const { value } = body

      // --- Resolve the workspace and project and check if the user can update the variable.
      const { ProjectVariable } = this.getRepositories()
      const project = await getProject.call(this, { user, workspace, name: projectName, permission: 'WriteVariables' })
      const variable = await ProjectVariable.findOneByOrFail({ project, name })

      // --- Update and return the variable.
      variable.value = value
      await ProjectVariable.save(variable)
    },
  )
}
