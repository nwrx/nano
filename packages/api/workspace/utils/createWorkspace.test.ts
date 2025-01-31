/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { createWorkspace } from './createWorkspace'

describe.concurrent<Context>('createWorkspace', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('create', (it) => {
    it('should create a new private workspace', async({ createUser, moduleWorkspace }) => {
      const { user } = await createUser()
      const workspace = await createWorkspace.call(moduleWorkspace, { user, name: 'workspace' })
      expect(workspace).toMatchObject({
        name: 'workspace',
        isPublic: false,
      })
    })

    it('should create a new public workspace', async({ createUser, moduleWorkspace }) => {
      const { user } = await createUser()
      const workspace = await createWorkspace.call(moduleWorkspace, { user, name: 'workspace', isPublic: true })
      expect(workspace).toMatchObject({
        name: 'workspace',
        isPublic: true,
        assignments: [expect.objectContaining({
          user: expect.objectContaining({ id: user.id }),
          permission: 'Owner',
        })],
      })
    })

    it('should assign the workspace to the user with full access', async({ createUser, moduleWorkspace }) => {
      const { user } = await createUser()
      const workspace = await createWorkspace.call(moduleWorkspace, { user, name: 'workspace' })
      expect(workspace).toMatchObject({
        name: 'workspace',
        isPublic: false,
      })
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if a workspace with the same name already exists', async({ createUser, moduleWorkspace }) => {
      const { user } = await createUser()
      const shouldReject = createWorkspace.call(moduleWorkspace, { user, name: 'jdoe' })
      const error = moduleWorkspace.errors.WORKSPACE_NAME_TAKEN('jdoe')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw an error if the workspace name is empty', async({ createUser, moduleWorkspace }) => {
      const { user } = await createUser()
      const shouldReject = createWorkspace.call(moduleWorkspace, { user, name: '' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the workspace name is missing', async({ createUser, moduleWorkspace }) => {
      const { user } = await createUser()
      // @ts-expect-error: testing missing `name` property
      const shouldReject = createWorkspace.call(moduleWorkspace, { user })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the workspace user id is not an UUID', async({ moduleWorkspace }) => {
    // @ts-expect-error: testing invalid `user.id`
      const shouldReject = createWorkspace.call(moduleWorkspace, { user: { id: 'not-a-uuid' }, name: 'workspace' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the user is not an instance of `User`', async({ moduleWorkspace }) => {
    // @ts-expect-error: testing missing `user.id` property
      const shouldReject = createWorkspace.call(moduleWorkspace, { user: {}, name: 'workspace' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the workspace is missing the user', async({ moduleWorkspace }) => {
    // @ts-expect-error: testing missing `user.id` property
      const shouldReject = createWorkspace.call(moduleWorkspace, { name: 'workspace' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })
  })
})
