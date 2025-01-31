/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-unexpected-multiline */
import type { Context } from '../../__fixtures__'
import type { User } from '../../user'
import type { WorkspacePermission } from './assertWorkspacePermission'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { ERRORS } from './errors'
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
    permission?: WorkspacePermission
    userPermission?: WorkspacePermission
    isPublic?: boolean
  }

  const allPermissions = ['Read', 'Write', 'Owner', undefined] as const
  const allWritePermissions = ['Write', 'Owner'] as const
  const allNonOwnerPermissions = ['Read', 'Write', undefined] as const

  async function createResult(context: Context, options: TestOptions = {}) {
    const { permission, user, userPermission, isPublic } = options
    const { workspace } = await context.createWorkspace('workspace', isPublic)
    if (user && userPermission) await context.assignWorkspace(workspace, user, userPermission)
    return await getWorkspace.call(context.moduleWorkspace, { user, name: workspace.name, permission })
  }

  async function expectOk(result: Promise<unknown>) {
    await expect(result).resolves.toMatchObject({ name: 'workspace' })
  }

  async function expectNotFound(shouldReject: Promise<unknown>) {
    const error = ERRORS.WORKSPACE_NOT_FOUND('workspace')
    await expect(shouldReject).rejects.toThrow(error)
  }

  async function expectNotAuthorized(shouldReject: Promise<unknown>) {
    const error = ERRORS.WORKSPACE_ACTION_NOT_AUTHORIZED('workspace')
    await expect(shouldReject).rejects.toThrow(error)
  }

  describe('with public workspace', () => {
    describe<Context>('without user', (it) => {
      it( 'should resolve if the request permission is "Read"', async(context) => {
        const result = createResult(context, { permission: 'Read', isPublic: true })
        await expectOk(result)
      })

      it.for(allWritePermissions)('should throw if the request permission is "%s"', async(permission, context) => {
        const shouldReject = createResult(context, { permission })
        await expectNotAuthorized(shouldReject)
      })
    })

    describe<Context>('with user without assignments', (it) => {
      it('should resolve if the request permission is "Read"', async(context) => {
        const { user } = await context.createUser()
        const result = createResult(context, { user, permission: 'Read', isPublic: true })
        await expectOk(result)
      })

      it.for(allWritePermissions)('should throw if the request permission is "%s"', async(permission, context) => {
        const { user } = await context.createUser()
        const shouldReject = createResult(context, { user, permission, isPublic: true })
        await expectNotAuthorized(shouldReject)
      })
    })

    describe<Context>('with user with "Read" permission', (it) => {
      it('should resolve if the request permission is "Read"', async(context) => {
        const { user } = await context.createUser()
        const result = createResult(context, { user, userPermission: 'Read', permission: 'Read', isPublic: true })
        await expectOk(result)
      })

      it.for(allWritePermissions)('should throw if the request permission is "%s"', async(permission, context) => {
        const { user } = await context.createUser()
        const shouldReject = createResult(context, { user, userPermission: 'Read', permission, isPublic: true })
        await expectNotAuthorized(shouldReject)
      })
    })

    describe<Context>('with user with "Write" permission', (it) => {
      it.for(allNonOwnerPermissions)('should resolve if the request permission is "%s"', async(permission, context) => {
        const { user } = await context.createUser()
        const result = createResult(context, { user, userPermission: 'Write', permission, isPublic: true })
        await expectOk(result)
      })

      it('should throw if the request permission is "Owner"', async(context) => {
        const { user } = await context.createUser()
        const shouldReject = createResult(context, { user, userPermission: 'Write', permission: 'Owner', isPublic: true })
        await expectNotAuthorized(shouldReject)
      })
    })

    describe<Context>('with user with "Owner" permission', (it) => {
      it.for(allPermissions)('should resolve if the request permission is "%s"', async(permission, context) => {
        const { user } = await context.createUser()
        const result = createResult(context, { user, userPermission: 'Owner', permission, isPublic: true })
        await expectOk(result)
      })
    })
  })

  describe<Context>('with private workspace', () => {
    describe<Context>('without user', (it) => {
      it('should throw if the request permission is "Read"', async(context) => {
        const shouldReject = createResult(context, { permission: 'Read' })
        await expectNotFound(shouldReject)
      })

      it.for(allWritePermissions)('should throw if the request permission is "%s"', async(permission, context) => {
        const shouldReject = createResult(context, { permission })
        await expectNotAuthorized(shouldReject)
      })
    })

    describe<Context>('with user without assignments', (it) => {
      it('should throw if the request permission is "Read"', async(context) => {
        const { user } = await context.createUser()
        const shouldReject = createResult(context, { user, permission: 'Read' })
        await expectNotFound(shouldReject)
      })

      it.for(allWritePermissions)
      ('should throw if the request permission is "%s"', async(permission, context) => {
        const { user } = await context.createUser()
        const shouldReject = createResult(context, { user, permission })
        await expectNotAuthorized(shouldReject)
      })
    })

    describe<Context>('with user with "Read" permission', (it) => {
      it('should resolve if the request permission is "Read"', async(context) => {
        const { user } = await context.createUser()
        const result = createResult(context, { user, userPermission: 'Read', permission: 'Read' })
        await expectOk(result)
      })

      it.for(allWritePermissions)('should throw if the request permission is "%s"', async(permission, context) => {
        const { user } = await context.createUser()
        const shouldReject = createResult(context, { user, userPermission: 'Read', permission })
        await expectNotAuthorized(shouldReject)
      })
    })

    describe<Context>('with user with "Write" permission', (it) => {
      it('should resolve if the request permission is "Write"', async(context) => {
        const { user } = await context.createUser()
        const result = createResult(context, { user, userPermission: 'Write', permission: 'Write' })
        await expectOk(result)
      })

      it('should throw if the request permission is "Read"', async(context) => {
        const { user } = await context.createUser()
        const shouldReject = createResult(context, { user, userPermission: 'Write', permission: 'Read' })
        await expectNotFound(shouldReject)
      })

      it('should throw if the request permission is "Owner"', async(context) => {
        const { user } = await context.createUser()
        const shouldReject = createResult(context, { user, userPermission: 'Write', permission: 'Owner' })
        await expectNotAuthorized(shouldReject)
      })
    })

    describe<Context>('with user with "Owner" permission', (it) => {
      it.for(allPermissions)('should resolve if the request permission is "%s"', async(permission, context) => {
        const { user } = await context.createUser()
        const result = createResult(context, { user, userPermission: 'Owner', permission })
        await expectOk(result)
      })
    })
  })

  describe<Context>('edge cases', (it) => {
    it('should throw if the workspace is not found', async({ moduleWorkspace }) => {
      const shouldReject = getWorkspace.call(moduleWorkspace, { name: 'workspace', permission: 'Read' })
      await expectNotFound(shouldReject)
    })

    it('should throw if the permission is invalid', async({ moduleWorkspace }) => {
      // @ts-expect-error: testing invalid input.
      const shouldReject = getWorkspace.call(moduleWorkspace, { name: 'workspace', permission: 'Invalid' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw if no name is provided', async({ moduleWorkspace }) => {
      const shouldReject = getWorkspace.call(moduleWorkspace, { permission: 'Read' } as any)
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw if the user does not have an "id" property', async({ moduleWorkspace }) => {
      // @ts-expect-error: testing invalid input.
      const shouldReject = getWorkspace.call(moduleWorkspace, { user: { id: 'not-an-uuid' }, name: 'workspace', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })
  })
}, 1000)
