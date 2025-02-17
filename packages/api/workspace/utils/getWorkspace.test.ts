/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { Context } from '../../__fixtures__'
import type { User } from '../../user'
import type { WorkspacePermission } from './assertWorkspacePermission'
import { EXP_UUID, ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { WORKSPACE_PERMISSIONS } from './assertWorkspacePermission'
import { ERRORS as E } from './errors'
import { getWorkspace } from './getWorkspace'

interface CreateResultOptions {
  user?: User
  permission: WorkspacePermission
  userWorkspacePermission?: WorkspacePermission
  isWorkspacePublic?: boolean
  hasReadPermission?: boolean
}

async function createResult(context: Context, options: CreateResultOptions) {
  const { permission, user, userWorkspacePermission, isWorkspacePublic, hasReadPermission } = options
  const { workspace } = await context.createWorkspace('workspace', isWorkspacePublic)
  if (user && userWorkspacePermission) await context.assignWorkspace(workspace, user, userWorkspacePermission)
  if (user && hasReadPermission && userWorkspacePermission !== 'Read') await context.assignWorkspace(workspace, user, 'Read')
  return await getWorkspace.call(context.moduleWorkspace, { user, name: workspace.name, permission })
}

describe.concurrent('getWorkspace', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe('permissions', () => {

    // Public or private workspace.
    for (const isWorkspacePublic of [true, false]) {
      describe<Context>(isWorkspacePublic ? 'with public workspace' : 'with private workspace', () => {

        // With or without read access.
        for (const hasReadPermission of [true, false]) {
          describe<Context>(hasReadPermission ? 'with user with read access' : 'with user without read access', () => {

            // Iterate over all possible user workspace permissions.
            for (const userWorkspacePermission of [...WORKSPACE_PERMISSIONS, undefined]) {
              describe<Context>(`with user with "${userWorkspacePermission}" permission on workspace`, (it) => {

                // Iterate over all possible request permissions.
                for (const permission of WORKSPACE_PERMISSIONS) {
                  const isOwner = userWorkspacePermission === 'Owner'
                  const hasReadAccess = hasReadPermission || isWorkspacePublic || userWorkspacePermission === 'Read'
                  const hasAccess = permission === userWorkspacePermission || permission === 'Read' && hasReadAccess

                  if (!isOwner && !hasReadAccess) {
                    it(`should throw "WORKSPACE_NOT_FOUND" when the request permission is "${permission}"`, async(context) => {
                      const { user } = await context.createUser()
                      const options = { user, userWorkspacePermission, permission, isWorkspacePublic, hasReadPermission }
                      const shouldReject = createResult(context, options)
                      const error = E.WORKSPACE_NOT_FOUND('workspace')
                      await expect(shouldReject).rejects.toThrow(error)
                    })
                  }
                  else if (isOwner || hasAccess) {
                    if (isOwner) {
                      it(`should resolve with the assignments when the request permission is "${permission}"`, async(context) => {
                        const { user } = await context.createUser()
                        const options = { user, userWorkspacePermission, permission, isWorkspacePublic, hasReadPermission }
                        const result = await createResult(context, options)
                        expect(result).toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'workspace' })
                        expect(result).toMatchObject({ assignments: expect.any(Array) })
                      })
                    }
                    else {
                      it(`should resolve without the assignments when the request permission is "${permission}"`, async(context) => {
                        const { user } = await context.createUser()
                        const options = { user, userWorkspacePermission, permission, isWorkspacePublic, hasReadPermission }
                        const result = await createResult(context, options)
                        expect(result).toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'workspace' })
                        expect(result).not.toHaveProperty('assignments')
                      })
                    }
                  }
                  else {
                    it(`should throw "WORKSPACE_ACTION_NOT_AUTHORIZED" when the request permission is "${permission}"`, async(context) => {
                      const { user } = await context.createUser()
                      const options = { user, userWorkspacePermission, permission, isWorkspacePublic, hasReadPermission }
                      const shouldReject = createResult(context, options)
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
            if (isWorkspacePublic && permission === 'Read') {
              it(`should resolve if the request permission is "${permission}"`, async(context) => {
                const result = createResult(context, { permission, isWorkspacePublic })
                await expect(result).resolves.toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'workspace' })
              })
            }
            else if (isWorkspacePublic && permission !== 'Read') {
              it(`should throw "WORKSPACE_ACTION_NOT_AUTHORIZED" if the request permission is "${permission}"`, async(context) => {
                const shouldReject = createResult(context, { permission, isWorkspacePublic })
                const error = E.WORKSPACE_ACTION_NOT_AUTHORIZED('workspace')
                await expect(shouldReject).rejects.toThrow(error)
              })
            }
            else {
              it(`should throw "WORKSPACE_NOT_FOUND" if the request permission is "${permission}"`, async(context) => {
                const shouldReject = createResult(context, { permission, isWorkspacePublic })
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
}, 1000)
