import type { ModuleProject, ProjectObject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assertString, assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { createProject } from '../utils'

export function projectCreate(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        name: [assertStringNotEmpty, toSlug],
        title: [[assertUndefined], [assertString]],
        description: [[assertUndefined], [assertString]],
      }),
    },
    async({ event, parameters, body }): Promise<ProjectObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { workspace } = parameters
      const { name, title, description } = body

      // --- Create and save the project.
      const project = await createProject.call(this, { name, title, description, workspace, user })
      const { Project } = this.getRepositories()
      await Project.save(project)

      // --- Return the serialized project.
      return project.serialize()
    },
  )
}
