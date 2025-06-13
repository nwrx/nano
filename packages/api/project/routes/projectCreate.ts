import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { createProject } from '../utils'

export function projectCreate(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/projects',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
      }),
      parseBody: createParser({
        name: [[assert.undefined], [assert.stringNotEmpty]],
        title: [[assert.undefined], [assert.stringNotEmpty]],
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Parse the options.
      let { name, title } = body
      if (!name && title) name = title
      else if (!title && name) title = toSlug(name)
      else throw new Error('E_PROJECT_NAME_OR_TITLE_REQUIRED')

      // --- Create the project in the workspace.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Write' })
      const project = await createProject.call(this, { name, title, workspace, user })

      // --- Save the project to the database.
      const { Project } = this.getRepositories()
      await Project.save(project)
    },
  )
}
