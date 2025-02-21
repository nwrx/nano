/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { Context } from '../../__fixtures__'
import type { WorkspacePermission } from './assertWorkspacePermission'
import { EXP_UUID, ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { WORKSPACE_PERMISSIONS } from './assertWorkspacePermission'
import { ERRORS as E } from './errors'
import { getWorkspace } from './getWorkspace'

interface TestMatrixOptions {
  isPublic?: boolean
  permission: WorkspacePermission
  withUser?: boolean
  withAccess?: WorkspacePermission
  withPermission?: WorkspacePermission
}

async function createResult(context: Context, options: TestMatrixOptions) {
  const { isPublic, permission, withUser, withAccess, withPermission } = options
  const { workspace } = await context.createWorkspace('workspace', isPublic)
  const { user } = withUser ? await context.createUser() : {}
  if (user && withPermission) await context.assignWorkspace(workspace, user, withPermission)
  if (user && withAccess && withAccess !== withPermission) await context.assignWorkspace(workspace, user, withAccess)
  return await getWorkspace.call(context.moduleWorkspace, { user, name: workspace.name, permission })
}

describe.concurrent('getWorkspace', { timeout: 300 }, () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe('permissions', () => {
    const WORKSPACE_READ_PERMISSIONS = ['Read', 'Owner'] as WorkspacePermission[]
    const WORKSPACE_EXTRA_PERMISSIONS = WORKSPACE_PERMISSIONS.filter(permission => !WORKSPACE_READ_PERMISSIONS.includes(permission))

    // Public or private workspace.
    for (const isPublic of [true, false]) {
      describe<Context>(isPublic ? 'with public workspace' : 'with private workspace', () => {

        // With or without read access.
        for (const withAccess of [...WORKSPACE_READ_PERMISSIONS, undefined]) {
          describe<Context>(withAccess ? `with user with ${withAccess} access` : 'with user without read access', () => {

            // With additional permission or not.
            for (const withPermission of [...WORKSPACE_EXTRA_PERMISSIONS, undefined]) {
              describe<Context>(withPermission ? `with user with ${withPermission} permission` : 'with user without additional permission', (it) => {

                // Iterate over all possible request permissions.
                for (const permission of WORKSPACE_PERMISSIONS) {
                  const hasReadAccess = withAccess !== undefined || isPublic
                  const hasAccess = permission === withPermission || (permission === 'Read' && hasReadAccess) || withAccess === 'Owner'

                  if (!hasReadAccess) {
                    it(`should throw "WORKSPACE_NOT_FOUND" when the request permission is "${permission}"`, async(context) => {
                      const shouldReject = createResult(context, { isPublic, permission, withUser: true, withAccess, withPermission })
                      const error = E.WORKSPACE_NOT_FOUND('workspace')
                      await expect(shouldReject).rejects.toThrow(error)
                    })
                  }
                  else if (hasAccess) {
                    it(`should return the workspace when the request permission is "${permission}"`, async(context) => {
                      const result = await createResult(context, { isPublic, permission, withUser: true, withAccess, withPermission })
                      expect(result).toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'workspace' })
                    })
                  }
                  else {
                    it(`should throw "WORKSPACE_ACTION_NOT_AUTHORIZED" when the request permission is "${permission}"`, async(context) => {
                      const shouldReject = createResult(context, { isPublic, permission, withUser: true, withAccess, withPermission })
                      const error = E.WORKSPACE_ACTION_NOT_AUTHORIZED('workspace')
                      await expect(shouldReject).rejects.toThrow(error)
                    })
                  }
                }
              })
            }
          })
        }

        describe<Context>('without user', (it) => {
          for (const permission of WORKSPACE_PERMISSIONS) {
            if (isPublic && permission === 'Read') {
              it(`should resolve if the request permission is "${permission}"`, async(context) => {
                const result = createResult(context, { permission, isPublic })
                await expect(result).resolves.toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'workspace' })
              })
            }
            else if (isPublic && permission !== 'Read') {
              it(`should throw "WORKSPACE_ACTION_NOT_AUTHORIZED" if the request permission is "${permission}"`, async(context) => {
                const shouldReject = createResult(context, { permission, isPublic })
                const error = E.WORKSPACE_ACTION_NOT_AUTHORIZED('workspace')
                await expect(shouldReject).rejects.toThrow(error)
              })
            }
            else {
              it(`should throw "WORKSPACE_NOT_FOUND" if the request permission is "${permission}"`, async(context) => {
                const shouldReject = createResult(context, { permission, isPublic })
                const error = E.WORKSPACE_NOT_FOUND('workspace')
                await expect(shouldReject).rejects.toThrow(error)
              })
            }
          }
        })
      })
    }
  })

  describe<Context>('edge cases', (it) => {
    it('should throw "WORKSPACE_NOT_FOUND" if the workspace is not found', async({ moduleWorkspace }) => {
      const shouldReject = getWorkspace.call(moduleWorkspace, { name: 'not-found', permission: 'Read' })
      const error = moduleWorkspace.errors.WORKSPACE_NOT_FOUND('not-found')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw a "ValidationError" if the request permission is not provided', async({ moduleWorkspace }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getWorkspace.call(moduleWorkspace, { name: 'workspace', permission: undefined })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw a "ValidationError" if the request permission is invalid', async({ moduleWorkspace }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getWorkspace.call(moduleWorkspace, { name: 'workspace', permission: 'Invalid' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw a "ValidationError" if workspace name is empty', async({ moduleWorkspace }) => {
      const shouldReject = getWorkspace.call(moduleWorkspace, { name: '', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw a "ValidationError" if the user is not provided', async({ moduleWorkspace }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getWorkspace.call(moduleWorkspace, { user: null, name: 'workspace', permission: 'Read' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if the user does not have an "id" property', async({ moduleWorkspace }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getWorkspace.call(moduleWorkspace, { user: {}, name: 'workspace', permission: 'Read' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })
  })
})
