/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import type { FlowPermission } from './assertFlowPermission'
import { EXP_UUID } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { FLOW_PERMISSIONS } from './assertFlowPermission'
import { searchFlow } from './searchFlow'

interface TestMatrixOptions {
  isPublic?: boolean
  withUser?: boolean
  withPermission?: FlowPermission
}

async function createResult(context: Context, options: TestMatrixOptions) {
  const { isPublic, withUser, withPermission } = options
  const { user } = withUser ? await context.setupUser() : {}
  const { workspace } = await context.setupWorkspace({ name: 'workspace' })
  const { project } = await context.setupProject({ name: 'flow', workspace, isPublic })
  await context.setupFlow({ name: 'flow', project, isPublic, assignments: [[user, withPermission]] })
  return await searchFlow.call(context.moduleFlow, { user, project })
}

describe('searchFlow', () => {
  beforeEach<Context>(createTestContext)

  // Public or private project
  for (const isPublic of [true, false]) {
    describe<Context>(isPublic ? 'with public project' : 'with private project', () => {

      // With or without user
      for (const withUser of [true, false]) {
        describe<Context>(withUser ? 'with user' : 'without user', () => {

          // Iterate over all possible request permissions
          for (const withPermission of [...FLOW_PERMISSIONS, undefined]) {
            describe<Context>(withPermission ? `with user with ${withPermission} permission` : 'with user without read permission', (it) => {

              if (isPublic || withUser && (withPermission === 'Read' || withPermission === 'Owner')) {
                it('should return the projects', async(context) => {
                  const result = await createResult(context, { isPublic, withUser, withPermission })
                  expect(result).toMatchObject([{ id: expect.stringMatching(EXP_UUID), name: 'flow' }])
                })
              }
              else {
                it('should return an empty array', async(context) => {
                  const result = await createResult(context, { isPublic, withUser, withPermission })
                  expect(result).toEqual([])
                })
              }
            })
          }
        })
      }
    })
  }

  describe<Context>('edge cases', (it) => {
    it('should return empty array when no matches found', async({ setupWorkspace, setupProject, setupFlow, moduleFlow }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      const { project } = await setupProject({ workspace, isPublic: true })
      await setupFlow({ project, isPublic: true, name: 'flow' })
      const results = await searchFlow.call(moduleFlow, { project, search: 'not-flow' })
      expect(results).toEqual([])
    })

    it('should find using case-insensitive search', async({ setupWorkspace, setupProject, setupFlow, moduleFlow }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      const { project } = await setupProject({ workspace, isPublic: true })
      await setupFlow({ project, isPublic: true, name: 'flow' })
      const results = await searchFlow.call(moduleFlow, { project, search: 'FLOW' })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('flow')
    })

    it('should return all projects when search is not provided', async({ setupWorkspace, setupProject, setupFlow, moduleFlow }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      const { project } = await setupProject({ workspace, isPublic: true })
      const { flow } = await setupFlow({ project, isPublic: true })
      const results = await searchFlow.call(moduleFlow, { project })
      expect(results).toHaveLength(1)
      expect(results[0]).toMatchObject({ id: flow.id, name: flow.name })
    })

    it('should respect pagination and ordering options', async({ setupWorkspace, setupProject, setupFlow, moduleFlow }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      const { project } = await setupProject({ workspace, isPublic: true })
      await setupFlow({ project, isPublic: true, name: 'flow1' })
      await setupFlow({ project, isPublic: true, name: 'flow2' })
      await setupFlow({ project, isPublic: true, name: 'flow3' })
      const results = await searchFlow.call(moduleFlow, { project, limit: 2, order: { name: 'DESC' } })
      expect(results).toHaveLength(2)
      expect(results[0].name).toBe('flow3')
      expect(results[1].name).toBe('flow2')
    })

    it('should sanitize special characters from search string', async({ setupWorkspace, setupProject, setupFlow, moduleFlow }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      const { project } = await setupProject({ workspace, isPublic: true })
      await setupFlow({ project, isPublic: true, name: 'flow' })
      const results = await searchFlow.call(moduleFlow, { project, search: 'flow!' })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('flow')
    })

    it('should preserve spaces and alphanumeric characters', async({ setupWorkspace, setupProject, setupFlow, moduleFlow }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      const { project } = await setupProject({ workspace, isPublic: true })
      const { flow } = await setupFlow({ project, isPublic: true, name: 'flow 123' })
      const results = await searchFlow.call(moduleFlow, { project, search: 'flow 123' })
      expect(results).toHaveLength(1)
      expect(results[0]).toMatchObject({ id: flow.id, name: flow.name })
    })

    it('should ignore search string with less than 3 characters', async({ setupWorkspace, setupProject, setupFlow, moduleFlow }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      const { project } = await setupProject({ workspace, isPublic: true })
      await setupFlow({ project, isPublic: true, name: 'foo' })
      await setupFlow({ project, isPublic: true, name: 'bar' })
      const results = await searchFlow.call(moduleFlow, { project, search: 'fo' })
      expect(results).toHaveLength(2)
      expect(results[0].name).toBe('bar')
      expect(results[1].name).toBe('foo')
    })
  })
})
