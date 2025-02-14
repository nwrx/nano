import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringConstantCase, assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getProject } from '../utils'

export function projectVariableDelete(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/:project/variables/:name',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        name: assertStringConstantCase,
      }),
    },
    async({ event, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project: projectName, name } = parameters

      // --- Get the project, assert permissions, and delete the variable.
      const { ProjectVariable } = this.getRepositories()
      const project = await getProject.call(this, { user, workspace, name: projectName, permission: 'WriteVariables' })
      const variable = await ProjectVariable.softRemove({ project, name })

      // --- Unset the value and soft-remove the variable.
      variable.value = ''
      await this.withTransaction(async() => {
        await ProjectVariable.save(variable)
        await ProjectVariable.softRemove(variable)
      })
    },
  )
}
