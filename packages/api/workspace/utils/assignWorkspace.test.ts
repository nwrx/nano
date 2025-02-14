/* eslint-disable no-unexpected-multiline */
import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { createTestContext } from '../../__fixtures__'
import { assignWorkspace } from './assignWorkspace'

describe.concurrent<Context>('assignWorkspace', { timeout: 300 }, () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('assign', (it) => {
    it.for(['Owner', 'Write', 'Read'] as const)
    ('should assign the user to the workspace with the "%s" permission', async(permission, { moduleWorkspace, createUser, createWorkspace }) => {
      const { user } = await createUser()
      const { workspace } = await createWorkspace()
      const assignment = await assignWorkspace.call(moduleWorkspace, { user, workspace, permission })
      const { WorkspaceAssignment } = moduleWorkspace.getRepositories()
      const result = await WorkspaceAssignment.findOneBy({ user, workspace: { id: workspace.id }, permission })
      expect(result).toMatchObject({ id: assignment.id, permission })
    })

    it('should create a "Read" assignment if the user does not have it', async({ moduleWorkspace, createUser, createWorkspace }) => {
      const { user } = await createUser()
      const { workspace } = await createWorkspace()
      await assignWorkspace.call(moduleWorkspace, { user, workspace, permission: 'Write' })
      const { WorkspaceAssignment } = moduleWorkspace.getRepositories()
      const result = await WorkspaceAssignment.findBy({ user, workspace: { id: workspace.id } })
      expect(result).toMatchObject([
        { permission: 'Read' },
        { permission: 'Write' },
      ])
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if the user is already assigned to the workspace', async({ moduleWorkspace, createUser, createWorkspace }) => {
      const { user } = await createUser()
      const { workspace } = await createWorkspace()
      await assignWorkspace.call(moduleWorkspace, { user, workspace, permission: 'Owner' })
      const shouldReject = assignWorkspace.call(moduleWorkspace, { user, workspace, permission: 'Owner' })
      const error = moduleWorkspace.errors.WORKSPACE_ALREADY_ASSIGNED(user.username, workspace.name, 'Owner')
      await expect(shouldReject).rejects.toThrowError(error)
    })

    it('should throw an error if the user does not have a valid permission', async({ moduleWorkspace, createUser, createWorkspace }) => {
      const { user } = await createUser()
      const { workspace } = await createWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = assignWorkspace.call(moduleWorkspace, { user, workspace, permission: 'Invalid' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw an error if the workspace id is not an UUID', async({ moduleWorkspace, createUser, createWorkspace }) => {
      const { user } = await createUser()
      const { workspace } = await createWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = assignWorkspace.call(moduleWorkspace, { user, workspace: { id: 'invalid', name: workspace.name }, permission: 'Owner' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw an error if the workspace name is empty', async({ moduleWorkspace, createUser, createWorkspace }) => {
      const { user } = await createUser()
      const { workspace } = await createWorkspace()
      const shouldReject = assignWorkspace.call(moduleWorkspace, { user, workspace: { id: workspace.id, name: '' }, permission: 'Owner' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw an error if the workspace name is missing', async({ moduleWorkspace, createUser, createWorkspace }) => {
      const { user } = await createUser()
      const { workspace } = await createWorkspace()
      // @ts-expect-error: testing missing `name` property
      const shouldReject = assignWorkspace.call(moduleWorkspace, { user, workspace: { id: workspace.id }, permission: 'Owner' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw an error if the user id is not an UUID', async({ moduleWorkspace, createWorkspace }) => {
      const { workspace } = await createWorkspace()
      // @ts-expect-error: testing invalid `user.id`
      const shouldReject = assignWorkspace.call(moduleWorkspace, { user: { id: 'invalid', username: 'user' }, workspace, permission: 'Owner' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw an error if the user username is empty', async({ moduleWorkspace, createWorkspace }) => {
      const { workspace } = await createWorkspace()
      const shouldReject = assignWorkspace.call(moduleWorkspace, { user: { id: randomUUID(), username: '' }, workspace, permission: 'Owner' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })
  })
})
