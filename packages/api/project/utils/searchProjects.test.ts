/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { EXP_UUID, ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { PROJECT_PERMISSIONS, type ProjectPermission } from './assertProjectPermission'
import { searchProjects } from './searchProjects'

interface TestMatrixOptions {
  isPublic?: boolean
  withUser?: boolean
  withPermission?: ProjectPermission
}

async function createResult(context: Context, options: TestMatrixOptions) {
  const { isPublic, withUser, withPermission } = options
  const { user } = withUser ? await context.setupUser() : {}
  const { workspace } = await context.setupWorkspace({ name: 'workspace' })
  await context.setupProject({ name: 'project', workspace, isPublic, assignments: [[user, withPermission]] })
  return await searchProjects.call(context.moduleProject, { user, workspace })
}

describe('searchProjects', () => {
  beforeEach<Context>(createTestContext)

  // Public or private project
  for (const isPublic of [true, false]) {
    describe<Context>(isPublic ? 'with public project' : 'with private project', () => {

      // With or without user
      for (const withUser of [true, false]) {
        describe<Context>(withUser ? 'with user' : 'without user', () => {

          // Iterate over all possible request permissions
          for (const withPermission of [...PROJECT_PERMISSIONS, undefined]) {
            describe<Context>(withPermission ? `with user with ${withPermission} permission` : 'with user without read permission', (it) => {

              if (isPublic || withUser && (withPermission === 'Read' || withPermission === 'Owner')) {
                it('should return the projects', async(context) => {
                  const result = await createResult(context, { isPublic, withUser, withPermission })
                  expect(result).toMatchObject([{ id: expect.stringMatching(EXP_UUID), name: 'project' }])
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

  describe<Context>('filtering', (it) => {
    it('should return empty array when no matches found', async({ setupWorkspace, moduleProject }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      const results = await searchProjects.call(moduleProject, { workspace, search: 'project' })
      expect(results).toEqual([])
    })

    it('should find using case-insensitive search', async({ setupWorkspace, setupProject, moduleProject }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      await setupProject({ workspace, isPublic: true, name: 'project' })
      const results = await searchProjects.call(moduleProject, { workspace, search: 'PROJECT' })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('project')
    })

    it('should return all projects when search is not provided', async({ setupWorkspace, setupProject, moduleProject }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      await setupProject({ workspace, isPublic: true, name: 'project1' })
      await setupProject({ workspace, isPublic: true, name: 'project2' })
      const results = await searchProjects.call(moduleProject, { workspace })
      expect(results).toHaveLength(2)
    })

    it('should respect pagination and ordering options', async({ setupWorkspace, setupProject, moduleProject }) => {
      const { workspace } = await setupWorkspace()
      await setupProject({ workspace, isPublic: true, name: 'project1' })
      await setupProject({ workspace, isPublic: true, name: 'project2' })
      await setupProject({ workspace, isPublic: true, name: 'project3' })
      const results = await searchProjects.call(moduleProject, { workspace, page: 3, limit: 1, order: { name: 'DESC' } })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('project1')
    })

    it('should sanitize special characters from search string', async({ setupWorkspace, setupProject, moduleProject }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      await setupProject({ workspace, isPublic: true, name: 'project' })
      const results = await searchProjects.call(moduleProject, { workspace, search: 'pro%ject' })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('project')
    })

    it('should preserve spaces and alphanumeric characters', async({ setupWorkspace, setupProject, moduleProject }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      await setupProject({ workspace, isPublic: true, name: 'project 123' })
      const results = await searchProjects.call(moduleProject, { workspace, search: 'project 123' })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('project 123')
    })

    it('should ignore search string with less than 3 characters', async({ setupWorkspace, setupProject, moduleProject }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      await setupProject({ workspace, isPublic: true, name: 'project' })
      const results = await searchProjects.call(moduleProject, { workspace, search: 'xx' })
      expect(results).toHaveLength(1)
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw a "ValidationError" if workspace is not provided', async({ moduleProject }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchProjects.call(moduleProject, { search: 'project' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if search is invalid', async({ setupWorkspace, moduleProject }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchProjects.call(moduleProject, { workspace, search: 123 })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if search is not a string', async({ setupWorkspace, moduleProject }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchProjects.call(moduleProject, { workspace, search: ['project'] })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if page is invalid', async({ setupWorkspace, moduleProject }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchProjects.call(moduleProject, { workspace, page: '1' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if limit is invalid', async({ setupWorkspace, moduleProject }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchProjects.call(moduleProject, { workspace, limit: '10' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw a "ValidationError" if user is invalid', async({ setupWorkspace, moduleProject }) => {
      const { workspace } = await setupWorkspace({ isPublic: true })
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchProjects.call(moduleProject, { workspace, user: 'user' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })
  })
})
