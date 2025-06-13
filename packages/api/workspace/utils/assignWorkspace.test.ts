/* eslint-disable no-unexpected-multiline */
import type { Context } from '../../__fixtures__'
import { AssertionError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { createTestContext } from '../../__fixtures__'
import { WORKSPACE_PERMISSIONS } from './assertWorkspacePermission'
import { assignWorkspace } from './assignWorkspace'

describe.concurrent<Context>('assignWorkspace', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('assign', (it) => {
    it.for(WORKSPACE_PERMISSIONS)
    ('should create assignments for the user to the workspace with the "%s" permission', async(permission, { moduleWorkspace, setupUser, setupWorkspace }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      const result = await assignWorkspace.call(moduleWorkspace, { user, workspace, permission })
      if (permission === 'Read') {
        expect(result).toHaveLength(1)
        expect(result[0]).toMatchObject({ user: { id: user.id }, workspace: { id: workspace.id }, permission })
      }
      else {
        expect(result).toHaveLength(2)
        expect(result[0]).toMatchObject({ user: { id: user.id }, workspace: { id: workspace.id }, permission: 'Read' })
        expect(result[1]).toMatchObject({ user: { id: user.id }, workspace: { id: workspace.id }, permission })
      }
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if the user is already assigned to the workspace', async({ moduleWorkspace, setupUser, setupWorkspace }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace({ assignments: [[user, 'Owner']] })
      const shouldReject = assignWorkspace.call(moduleWorkspace, { user, workspace, permission: 'Owner' })
      const error = moduleWorkspace.errors.WORKSPACE_ALREADY_ASSIGNED(user.username, workspace.name, 'Owner')
      await expect(shouldReject).rejects.toThrowError(error)
    })

    it('should throw an error if the user does not have a valid permission', async({ moduleWorkspace, setupUser, setupWorkspace }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = assignWorkspace.call(moduleWorkspace, { user, workspace, permission: 'Invalid' })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })

    it('should throw an error if the workspace id is not an UUID', async({ moduleWorkspace, setupUser, setupWorkspace }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = assignWorkspace.call(moduleWorkspace, { user, workspace: { id: 'invalid', name: workspace.name }, permission: 'Owner' })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })

    it('should throw an error if the workspace name is empty', async({ moduleWorkspace, setupUser, setupWorkspace }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = assignWorkspace.call(moduleWorkspace, { user, workspace: { id: workspace.id, name: '' }, permission: 'Owner' })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })

    it('should throw an error if the workspace name is missing', async({ moduleWorkspace, setupUser, setupWorkspace }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing missing `name` property
      const shouldReject = assignWorkspace.call(moduleWorkspace, { user, workspace: { id: workspace.id }, permission: 'Owner' })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })

    it('should throw an error if the user id is not an UUID', async({ moduleWorkspace, setupWorkspace }) => {
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid `user.id`
      const shouldReject = assignWorkspace.call(moduleWorkspace, { user: { id: 'invalid', username: 'user' }, workspace, permission: 'Owner' })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })

    it('should throw an error if the user username is empty', async({ moduleWorkspace, setupWorkspace }) => {
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = assignWorkspace.call(moduleWorkspace, { user: { id: randomUUID(), username: '' }, workspace, permission: 'Owner' })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })
  })
})
