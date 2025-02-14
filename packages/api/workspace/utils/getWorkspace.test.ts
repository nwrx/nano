/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { Context } from '../../__fixtures__'
import type { User } from '../../user'
import type { WorkspacePermission } from './assertWorkspacePermission'
import { EXP_UUID, ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { ERRORS as E } from './errors'
import { getWorkspace } from './getWorkspace'

describe.concurrent('getWorkspace', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  interface TestOptions {
    user?: User
    permission: WorkspacePermission
    userWorkspacePermission?: WorkspacePermission
    isWorkspacePublic?: boolean
  }

  async function createResult(context: Context, options: TestOptions) {
    const { permission, user, userWorkspacePermission, isWorkspacePublic } = options
    const { workspace } = await context.createWorkspace('workspace', isWorkspacePublic)
    if (user && userWorkspacePermission) await context.assignWorkspace(workspace, user, userWorkspacePermission)
    return await getWorkspace.call(context.moduleWorkspace, { user, name: workspace.name, permission })
  }

  const allWorkspacePermissions = ['Owner', 'Write', 'Read', undefined] as const

  for (const isWorkspacePublic of [true, false]) {
    describe<Context>(isWorkspacePublic ? 'with public workspace' : 'with private workspace', () => {
      for (const userWorkspacePermission of allWorkspacePermissions) {
        describe<Context>(`with user with "${userWorkspacePermission}" permission on workspace`, (it) => {
          for (const permission of allWorkspacePermissions) {
            if (!permission) continue

            const hasImplicitReadAccess = userWorkspacePermission !== undefined
            const hasWorkspacePermission = userWorkspacePermission === permission || userWorkspacePermission === 'Owner'

            let error: Error | undefined

            // --- If the request permission is 'Read', allow public workspaces to be retrieved.
            // --- In our context, any permission on a workspace implicitly grants 'Read' access.
            if (permission === 'Read') {
              if (!isWorkspacePublic && !hasImplicitReadAccess)
                error = E.WORKSPACE_NOT_FOUND('workspace')
            }

            // --- For any other permission, the user must have a matching permission
            // --- to the workspace itself or be an owner of the workspace.
            else if (!hasWorkspacePermission) {
              error = E.WORKSPACE_ACTION_NOT_AUTHORIZED('workspace')
            }

            if (error) {
              it(`should throw when the request permission is "${permission}"`, async(context) => {
                const { user } = await context.createUser()
                const options = { user, userWorkspacePermission, permission, isWorkspacePublic }
                const shouldReject = createResult(context, options)
                await expect(shouldReject).rejects.toThrow(error)
              })
            }

            else {
              it(`should resolve if the request permission is "${permission}"`, async(context) => {
                const { user } = await context.createUser()
                const options = { user, userWorkspacePermission, permission, isWorkspacePublic }
                const result = createResult(context, options)
                await expect(result).resolves.toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'workspace' })
              })
            }
          }
        })
      }

      describe<Context>('without user', (it) => {
        for (const permission of allWorkspacePermissions.filter(Boolean)) {
          if (!permission) continue
          if (isWorkspacePublic && permission === 'Read') {
            it(`should resolve if the request permission is "${permission}"`, async(context) => {
              const result = createResult(context, { permission, isWorkspacePublic })
              await expect(result).resolves.toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'workspace' })
            })
          }
          else if (permission === 'Read') {
            it(`should throw an error if the request permission is "${permission}"`, async(context) => {
              const shouldReject = createResult(context, { permission, isWorkspacePublic })
              const error = E.WORKSPACE_NOT_FOUND('workspace')
              await expect(shouldReject).rejects.toThrow(error)
            })
          }
          else {
            it(`should throw an error if the request permission is "${permission}"`, async(context) => {
              const shouldReject = createResult(context, { permission, isWorkspacePublic })
              const error = E.WORKSPACE_ACTION_NOT_AUTHORIZED('workspace')
              await expect(shouldReject).rejects.toThrow(error)
            })
          }
        }
      })
    })
  }

  describe<Context>('edge cases', (it) => {
    it('should throw if the workspace is not found', async({ moduleWorkspace }) => {
      const shouldReject = getWorkspace.call(moduleWorkspace, { name: 'not-found', permission: 'Read' })
      const error = moduleWorkspace.errors.WORKSPACE_NOT_FOUND('not-found')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the request permission is not provided', async({ moduleWorkspace }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getWorkspace.call(moduleWorkspace, { name: 'workspace', permission: undefined })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw if the request permission is invalid', async({ moduleWorkspace }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getWorkspace.call(moduleWorkspace, { name: 'workspace', permission: 'Invalid' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw if workspace name is empty', async({ moduleWorkspace }) => {
      const shouldReject = getWorkspace.call(moduleWorkspace, { name: '', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw if the user is not provided', async({ moduleWorkspace }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getWorkspace.call(moduleWorkspace, { user: null, name: 'workspace', permission: 'Read' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw if the user does not have an "id" property', async({ moduleWorkspace }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getWorkspace.call(moduleWorkspace, { user: {}, name: 'workspace', permission: 'Read' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })
  })
}, 1000)
