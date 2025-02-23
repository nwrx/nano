/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { Context } from '../../__fixtures__'
import type { FlowPermission } from './assertFlowPermission'
import { EXP_UUID, ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { FLOW_PERMISSIONS } from './assertFlowPermission'
import { ERRORS as E } from './errors'
import { getFlow } from './getFlow'

interface TestMatrixOptions {
  isPublic?: boolean
  permission: FlowPermission
  withUser?: boolean
  withAccess?: FlowPermission
  withPermission?: FlowPermission
}

async function createResult(context: Context, options: TestMatrixOptions) {
  const { isPublic, permission, withUser, withAccess, withPermission } = options
  const { user } = withUser ? await context.setupUser() : {}
  const { workspace } = await context.setupWorkspace({ name: 'workspace' })
  const { project } = await context.setupProject({ name: 'project', workspace })
  const { flow } = await context.setupFlow({ name: 'flow', project, isPublic, assignments: [[user, withAccess, withPermission]] })
  return await getFlow.call(context.moduleFlow, { user, workspace, project, name: flow.name, permission })
}

describe('getFlow', () => {
  beforeEach<Context>(createTestContext)

  const FLOW_READ_PERMISSIONS = ['Read', 'Owner'] as FlowPermission[]
  const FLOW_EXTRA_PERMISSIONS = FLOW_PERMISSIONS.filter(permission => !FLOW_READ_PERMISSIONS.includes(permission))

  // Public or private flow
  for (const isPublic of [true, false]) {
    describe<Context>(isPublic ? 'with public flow' : 'with private flow', () => {

      // With or without read access
      for (const withAccess of [...FLOW_READ_PERMISSIONS, undefined]) {
        describe<Context>(withAccess ? `with user with ${withAccess} access` : 'with user without read access', () => {

          // With additional permission or not
          for (const withPermission of [...FLOW_EXTRA_PERMISSIONS, undefined]) {
            describe<Context>(withPermission ? `with user with ${withPermission} permission` : 'with user without extra permission', (it) => {

              // Iterate over all possible request permissions
              for (const permission of FLOW_PERMISSIONS) {
                const canRead = isPublic || FLOW_READ_PERMISSIONS.includes(withAccess!)
                const canAccess = (permission === 'Read' && canRead) || permission === withPermission || withAccess === 'Owner'

                if (canRead && canAccess) {
                  it(`should return the flow when the request permission is "${permission}"`, async(context) => {
                    const result = await createResult(context, { isPublic, permission, withUser: true, withAccess, withPermission })
                    expect(result).toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'flow' })
                  })
                }
                else if (canRead) {
                  it(`should throw "FLOW_FORBIDDEN" when the request permission is "${permission}"`, async(context) => {
                    const shouldReject = createResult(context, { isPublic, permission, withUser: true, withAccess, withPermission })
                    const error = E.FLOW_FORBIDDEN('workspace', 'project', 'flow')
                    await expect(shouldReject).rejects.toThrow(error)
                  })
                }
                else {
                  it(`should throw "FLOW_NOT_FOUND" when the request permission is "${permission}"`, async(context) => {
                    const shouldReject = createResult(context, { isPublic, permission, withUser: true, withAccess, withPermission })
                    const error = E.FLOW_NOT_FOUND('workspace', 'project', 'flow')
                    await expect(shouldReject).rejects.toThrow(error)
                  })
                }
              }
            })
          }
        })
      }

      describe<Context>('without user', (it) => {
        for (const permission of FLOW_PERMISSIONS) {
          if (isPublic && permission === 'Read') {
            it(`should resolve if the request permission is "${permission}"`, async(context) => {
              const result = createResult(context, { permission, isPublic })
              await expect(result).resolves.toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'flow' })
            })
          }
          else if (isPublic && permission !== 'Read') {
            it(`should throw "FLOW_UNAUTHORIZED" if the request permission is "${permission}"`, async(context) => {
              const shouldReject = createResult(context, { permission, isPublic })
              const error = E.FLOW_UNAUTHORIZED('workspace', 'project', 'flow')
              await expect(shouldReject).rejects.toThrow(error)
            })
          }
          else {
            it(`should throw "FLOW_NOT_FOUND" if the request permission is "${permission}"`, async(context) => {
              const shouldReject = createResult(context, { permission, isPublic })
              const error = E.FLOW_NOT_FOUND('workspace', 'project', 'flow')
              await expect(shouldReject).rejects.toThrow(error)
            })
          }
        }
      })
    })
  }

  describe<Context>('edge cases', (it) => {
    it('should throw "FLOW_NOT_FOUND" if the flow is not found', async({ moduleFlow, setupWorkspace, setupProject }) => {
      const { workspace } = await setupWorkspace({ name: 'workspace' })
      const { project } = await setupProject({ name: 'project', workspace })
      const shouldReject = getFlow.call(moduleFlow, { workspace, project, name: 'not-found', permission: 'Read' })
      const error = moduleFlow.errors.FLOW_NOT_FOUND('workspace', 'project', 'not-found')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw a "ValidationError" if the request permission is not provided', async({ moduleFlow, setupWorkspace, setupProject }) => {
      const { workspace } = await setupWorkspace()
      const { project } = await setupProject({ workspace })
      // @ts-expect-error: testing invalid input
      const shouldReject = getFlow.call(moduleFlow, { workspace, project, name: 'flow', permission: undefined })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw a "ValidationError" if the request permission is invalid', async({ moduleFlow, setupWorkspace, setupProject }) => {
      const { workspace } = await setupWorkspace()
      const { project } = await setupProject({ workspace })
      // @ts-expect-error: testing invalid input
      const shouldReject = getFlow.call(moduleFlow, { workspace, project, name: 'flow', permission: 'Invalid' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw a "ValidationError" if flow name is empty', async({ moduleFlow, setupWorkspace, setupProject }) => {
      const { workspace } = await setupWorkspace()
      const { project } = await setupProject({ workspace })
      const shouldReject = getFlow.call(moduleFlow, { workspace, project, name: '', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw a "ValidationError" if the user does not have an "id" property', async({ moduleFlow, setupWorkspace, setupProject }) => {
      const { workspace } = await setupWorkspace()
      const { project } = await setupProject({ workspace })
      // @ts-expect-error: testing invalid input
      const shouldReject = getFlow.call(moduleFlow, { workspace, project, user: {}, name: 'flow', permission: 'Read' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if workspace is not provided', async({ moduleFlow, setupWorkspace, setupProject }) => {
      const { workspace } = await setupWorkspace()
      const { project } = await setupProject({ workspace })
      // @ts-expect-error: testing invalid input
      const shouldReject = getFlow.call(moduleFlow, { project, name: 'flow', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw a "ValidationError" if project is not provided', async({ moduleFlow, setupWorkspace }) => {
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = getFlow.call(moduleFlow, { workspace, name: 'flow', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })
  })
})
