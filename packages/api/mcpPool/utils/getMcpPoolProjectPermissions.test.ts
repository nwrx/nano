import type { Context } from '../../__fixtures__'
import { AssertionError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { getMcpPoolProjectPermissions } from './getMcpPoolProjectPermissions'

describe('getMcpPoolProjectPermissions', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('success cases', (it) => {
    it('should return project assignments for an MCP pool', async(context) => {
      // Setup projects
      const { user, workspace } = await context.setupUser()
      const { project: project1 } = await context.setupProject({ workspace, name: 'project1' })
      const { project: project2 } = await context.setupProject({ workspace, name: 'project2' })

      // Setup MCP pool with project assignments
      const { pool } = await context.setupMcpPool({
        user,
        workspace,
        projects: [
          [project1, 'Read'],
          [project2, 'Read', 'Write'],
        ],
      })

      // Get and verify project assignments
      const result = await getMcpPoolProjectPermissions.call(context.moduleMcp, { pool })
      expect(result).toStrictEqual({
        project1: ['Read'],
        project2: ['Read', 'Write'],
      })
    })

    it('should return empty object for MCP pool with no project assignments', async(context) => {
      const { user, workspace } = await context.setupUser()
      const { pool } = await context.setupMcpPool({ user, workspace })
      const result = await getMcpPoolProjectPermissions.call(context.moduleMcp, { pool })
      expect(result).toEqual({})
    })

    it('should handle MCP pool with single project having multiple permissions', async(context) => {
      const { user, workspace } = await context.setupUser()
      const { project } = await context.setupProject({ workspace, name: 'test-project' })

      const { pool } = await context.setupMcpPool({
        user,
        workspace,
        projects: [
          [project, 'Read'],
          [project, 'Write'],
        ],
      })

      const result = await getMcpPoolProjectPermissions.call(context.moduleMcp, { pool })
      expect(result).toStrictEqual({ 'test-project': ['Read', 'Write'] })
    })

    it('should handle multiple projects with different permission combinations', async(context) => {
      const { user, workspace } = await context.setupUser()
      const { project: project1 } = await context.setupProject({ workspace, name: 'readonly-project' })
      const { project: project2 } = await context.setupProject({ workspace, name: 'readwrite-project' })
      const { project: project3 } = await context.setupProject({ workspace, name: 'admin-project' })

      const { pool } = await context.setupMcpPool({
        user,
        workspace,
        projects: [
          [project1, 'Read'],
          [project2, 'Read', 'Write'],
          [project3, 'Owner'],
        ],
      })

      const result = await getMcpPoolProjectPermissions.call(context.moduleMcp, { pool })
      expect(result).toStrictEqual({
        'readonly-project': ['Read'],
        'readwrite-project': ['Read', 'Write'],
        'admin-project': ['Owner'],
      })
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw AssertionError if options are not provided', async(context) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getMcpPoolProjectPermissions.call(context.moduleMcp, {})
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw AssertionError on invalid pool', async(context) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getMcpPoolProjectPermissions.call(context.moduleMcp, { pool: 'invalid' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })
  })
})
