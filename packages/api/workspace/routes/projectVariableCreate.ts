import type { ModuleWorkspace } from '../index'
import { ModuleUser } from '@nwrx/api'
import { createRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'

export function projectVariableCreate(this: ModuleWorkspace) {
  return createRoute(
    {
      name: 'POST /api/workspaces/:workspace/:project/variables',
      parameters: createSchema({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
      }),
      body: createSchema({
        name: assert.stringConstantCase.with('The name of the variable must be in constant case.'),
        value: assert.stringNotEmpty.with('The value of the variable must not be a non-empty string.'),
      }),
    },
    async({ event, body, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project } = parameters
      const { name, value } = body

      // --- Generate a new variable for the project.
      const { WorkspaceProjectVariable } = this.getRepositories()
      const variable = await this.createProjectVariable({ workspace, project, name, value, user })
      await WorkspaceProjectVariable.save(variable)
    },
  )
}
