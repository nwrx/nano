import type { ModuleWorkspace } from '../index'
import { ModuleUser } from '@nwrx/api'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, createArrayParser, createSchema } from '@unshared/validation'
import { assertProjectPermission } from '../utils'

export function projectUpdateUserAssignments(this: ModuleWorkspace) {
  return createRoute(
    {
      name: 'PUT /api/workspaces/:workspace/:project/assignments/:username',
      parameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        username: assertStringNotEmpty,
      }),
      body: createSchema({
        permissions: createArrayParser(assertProjectPermission),
      }),
    },
    async({ event, parameters, body }) => this.withTransaction(async() => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { WorkspaceProjectAssignment, WorkspaceProject } = this.getRepositories()
      const { project, workspace, username } = parameters
      const { permissions } = body

      // --- Resolve the workspace and project and assert the user has access to them.
      const workspaceResolved = await this.resolveWorkspace({ user, name: workspace, permission: 'Read' })
      const { id } = await this.resolveProject({ user, name: project, workspace: workspaceResolved, permission: 'Owner' })

      // --- Get the existing assignments to the user.
      const userToAssign = await userModule.resolveUser({ username, user })
      const existingAssignments = await WorkspaceProjectAssignment.findBy({ user: userToAssign, project: { id } })
      const projectEntity = await WorkspaceProject.findOneOrFail({ where: { id }, relations: { assignments: true } })

      // --- Iterate over the permissions and create the assignments.
      for (const permission of permissions) {
        const isAlreadyAssigned = existingAssignments.some(assignment => assignment.permission === permission)
        if (isAlreadyAssigned) continue
        const assignment = WorkspaceProjectAssignment.create({ user: userToAssign, permission })
        projectEntity.assignments!.push(assignment)
      }

      // --- Iterate over the existing assignments and remove any that are not in the new permissions.
      for (const assignment of existingAssignments) {
        const isStillAssigned = permissions.includes(assignment.permission)
        if (isStillAssigned) continue
        projectEntity.assignments = projectEntity.assignments!.filter(a => a.id !== assignment.id)
      }

      // --- Create the assignment.
      await WorkspaceProject.save(projectEntity)
    }),
  )
}
