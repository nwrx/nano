import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createArrayParser, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { assertProjectPermission, getProject } from '../utils'

export function projectUpdateUserAssignments(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/:project/assignments/:username',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        username: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        permissions: createArrayParser(assertProjectPermission),
      }),
    },
    async({ event, parameters, body }) => this.withTransaction(async() => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { ProjectAssignment, Project } = this.getRepositories()
      const { project: projectName, workspace, username } = parameters
      const { permissions } = body

      // --- Get the project and it's assignments to the user.
      const { id } = await getProject.call(this, { user, name: projectName, workspace, permission: 'Owner' })
      const userToAssign = await userModule.getUser({ username, user })
      const project = await Project.findOneOrFail({ where: { id }, relations: { assignments: true } })
      const existingAssignments = await ProjectAssignment.findBy({ user: userToAssign, project: { id } })

      // --- Iterate over the permissions and create the assignments.
      for (const permission of permissions) {
        const isAlreadyAssigned = existingAssignments.some(assignment => assignment.permission === permission)
        if (isAlreadyAssigned) continue
        const assignment = ProjectAssignment.create({ user: userToAssign, permission })
        project.assignments!.push(assignment)
      }

      // --- Iterate over the existing assignments and remove any that are not in the new permissions.
      for (const assignment of existingAssignments) {
        const isStillAssigned = permissions.includes(assignment.permission)
        if (isStillAssigned) continue
        project.assignments = project.assignments!.filter(a => a.id !== assignment.id)
      }

      // --- Create the assignment.
      await Project.save(project)
    }),
  )
}
