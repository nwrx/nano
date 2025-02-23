/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { Context } from '../../__fixtures__'
import type { ProjectPermission } from './assertProjectPermission'
import { EXP_UUID, ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { PROJECT_PERMISSIONS } from './assertProjectPermission'
import { ERRORS as E } from './errors'
import { getProject } from './getProject'

interface TestMatrixOptions {
  isPublic?: boolean
  permission: ProjectPermission
  withUser?: boolean
  withAccess?: ProjectPermission
  withPermission?: ProjectPermission
}

async function createResult(context: Context, options: TestMatrixOptions) {
  const { isPublic, permission, withUser, withAccess, withPermission } = options
  const { user } = withUser ? await context.setupUser() : {}
  const { workspace } = await context.setupWorkspace({ name: 'workspace' })
  const { project } = await context.setupProject({ name: 'project', workspace, isPublic, assignments: [[user, withAccess, withPermission]] })
  return await getProject.call(context.moduleProject, { user, workspace, name: project.name, permission })
}

describe('getProject', () => {
  beforeEach<Context>(createTestContext)

  const PROJECT_READ_PERMISSIONS = ['Read', 'Owner'] as ProjectPermission[]
  const PROJECT_EXTRA_PERMISSIONS = PROJECT_PERMISSIONS.filter(permission => !PROJECT_READ_PERMISSIONS.includes(permission))

  // Public or private project
  for (const isPublic of [true, false]) {
    describe<Context>(isPublic ? 'with public project' : 'with private project', () => {

      // With or without read access
      for (const withAccess of [...PROJECT_READ_PERMISSIONS, undefined]) {
        describe<Context>(withAccess ? `with user with ${withAccess} access` : 'with user without read access', () => {

          // With additional permission or not
          for (const withPermission of [...PROJECT_EXTRA_PERMISSIONS, undefined]) {
            describe<Context>(withPermission ? `with user with ${withPermission} permission` : 'with user without extra permission', (it) => {

              // Iterate over all possible request permissions
              for (const permission of PROJECT_PERMISSIONS) {
                const isRead = isPublic || PROJECT_READ_PERMISSIONS.includes(withAccess!)
                const isAllowed = (permission === 'Read' && isRead) || permission === withPermission || withAccess === 'Owner'

                if (!isRead) {
                  it(`should throw "PROJECT_NOT_FOUND" when the request permission is "${permission}"`, async(context) => {
                    const shouldReject = createResult(context, { isPublic, permission, withUser: true, withAccess, withPermission })
                    const error = E.PROJECT_NOT_FOUND('workspace', 'project')
                    await expect(shouldReject).rejects.toThrow(error)
                  })
                }
                else if (isAllowed) {
                  it(`should return the project when the request permission is "${permission}"`, async(context) => {
                    const result = await createResult(context, { isPublic, permission, withUser: true, withAccess, withPermission })
                    expect(result).toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'project' })
                  })
                }
                else {
                  it(`should throw "PROJECT_FORBIDDEN" when the request permission is "${permission}"`, async(context) => {
                    const shouldReject = createResult(context, { isPublic, permission, withUser: true, withAccess, withPermission })
                    const error = E.PROJECT_FORBIDDEN('workspace', 'project')
                    await expect(shouldReject).rejects.toThrow(error)
                  })
                }
              }
            })
          }
        })
      }

      describe<Context>('without user', (it) => {
        for (const permission of PROJECT_PERMISSIONS) {
          if (isPublic && permission === 'Read') {
            it(`should resolve if the request permission is "${permission}"`, async(context) => {
              const result = createResult(context, { permission, isPublic })
              await expect(result).resolves.toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'project' })
            })
          }
          else if (isPublic && permission !== 'Read') {
            it(`should throw "PROJECT_UNAUTHORIZED" if the request permission is "${permission}"`, async(context) => {
              const shouldReject = createResult(context, { permission, isPublic })
              const error = E.PROJECT_UNAUTHORIZED('workspace', 'project')
              await expect(shouldReject).rejects.toThrow(error)
            })
          }
          else {
            it(`should throw "PROJECT_NOT_FOUND" if the request permission is "${permission}"`, async(context) => {
              const shouldReject = createResult(context, { permission, isPublic })
              const error = E.PROJECT_NOT_FOUND('workspace', 'project')
              await expect(shouldReject).rejects.toThrow(error)
            })
          }
        }
      })
    })
  }

  describe<Context>('edge cases', (it) => {
    it('should throw "PROJECT_NOT_FOUND" if the project is not found', async({ moduleProject, setupWorkspace }) => {
      const { workspace } = await setupWorkspace({ name: 'workspace' })
      const shouldReject = getProject.call(moduleProject, { workspace, name: 'not-found', permission: 'Read' })
      const error = moduleProject.errors.PROJECT_NOT_FOUND('workspace', 'not-found')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw a "ValidationError" if the request permission is not provided', async({ moduleProject, setupWorkspace }) => {
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = getProject.call(moduleProject, { workspace, name: 'project', permission: undefined })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw a "ValidationError" if the request permission is invalid', async({ moduleProject, setupWorkspace }) => {
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = getProject.call(moduleProject, { workspace, name: 'project', permission: 'Invalid' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw a "ValidationError" if project name is empty', async({ moduleProject, setupWorkspace }) => {
      const { workspace } = await setupWorkspace()
      const shouldReject = getProject.call(moduleProject, { workspace, name: '', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw a "ValidationError" if the user does not have an "id" property', async({ moduleProject, setupWorkspace }) => {
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = getProject.call(moduleProject, { workspace, user: {}, name: 'project', permission: 'Read' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if workspace is not provided', async({ moduleProject }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getProject.call(moduleProject, { name: 'project', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })
  })
})
