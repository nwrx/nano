/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ModuleUser } from '@nwrx/api/user'
import { EXP_UUID } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { ModuleWorkspace } from '../index'

const { application, reset, destroy } = await createTestContext()
const { Workspace, WorkspaceAssignment } = application.getModule(ModuleWorkspace).entities
const { User } = application.getModule(ModuleUser).entities

beforeEach(async() => {
  await reset()
  vi.useFakeTimers({ now: new Date('2000-01-01T00:00:00Z') })
})

afterEach(() => {
  vi.useRealTimers()
})

afterAll(async() => {
  await destroy()
})

describe('instance', () => {
  it('should create a new workspace assignment', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'john-doe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const assignment = await WorkspaceAssignment.create({ user, workspace, permission: 'Owner' }).save()
    const result = await WorkspaceAssignment.findOne({
      where: { id: assignment.id },
      relations: { user: true, workspace: true },
    })
    expect(result).toBeInstanceOf(WorkspaceAssignment)
    expect(result).toMatchObject({
      id: expect.stringMatching(EXP_UUID),
      user: { id: user.id },
      workspace: { id: workspace.id },
      createdAt: new Date('2000-01-01T00:00:00Z'),
      updatedAt: new Date('2000-01-01T00:00:00Z'),
      deletedAt: undefined,
    })
  })

  it('should create multiple assignments for the same user and workspace', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    await WorkspaceAssignment.create({ user, workspace, permission: 'Read' }).save()
    await WorkspaceAssignment.create({ user, workspace, permission: 'Write' }).save()
    const result = await WorkspaceAssignment.find()
    expect(result).toHaveLength(2)
  })

  it('should create multiple assignments for different users and the same workspace', async() => {
    const user1 = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const user2 = await User.create({ email: 'paul.doe@acme.com', username: 'pdoe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    await WorkspaceAssignment.create({ user: user1, workspace, permission: 'Read' }).save()
    await WorkspaceAssignment.create({ user: user2, workspace, permission: 'Write' }).save()
    const result = await WorkspaceAssignment.find()
    expect(result).toHaveLength(2)
  })
})

describe('cascade', () => {
  it('should delete the workspace assignments when the workspace is deleted', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    await WorkspaceAssignment.create({ user, workspace, permission: 'Read' }).save()
    await WorkspaceAssignment.create({ user, workspace, permission: 'Write' }).save()
    await workspace.remove()
    const result = await WorkspaceAssignment.find()
    expect(result).toHaveLength(0)
  })

  it('should delete the workspace assignments when the user is deleted', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    await WorkspaceAssignment.create({ user, workspace, permission: 'Read' }).save()
    await WorkspaceAssignment.create({ user, workspace, permission: 'Write' }).save()
    await user.remove()
    const result = await WorkspaceAssignment.find()
    expect(result).toHaveLength(0)
  })
})

describe('edge cases', () => {
  it('should throw an error if the user is not defined', async() => {
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const assignment = WorkspaceAssignment.create({ workspace, permission: 'Read' })
    const shouldReject = assignment.save()
    await expect(shouldReject).rejects.toThrow('SQLITE_CONSTRAINT: NOT NULL constraint failed: WorkspaceAssignment.userId')
  })

  it('should throw an error if the workspace is not defined', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const assignment = WorkspaceAssignment.create({ user, permission: 'Read' })
    const shouldReject = assignment.save()
    await expect(shouldReject).rejects.toThrow('SQLITE_CONSTRAINT: NOT NULL constraint failed: WorkspaceAssignment.workspaceId')
  })

  it('should throw an error if the permission is not defined', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const assignment = WorkspaceAssignment.create({ user, workspace })
    const shouldReject = assignment.save()
    await expect(shouldReject).rejects.toThrow('SQLITE_CONSTRAINT: NOT NULL constraint failed: WorkspaceAssignment.permission')
  })

  it('should throw an error on duplicate assignments', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const assignment1 = WorkspaceAssignment.create({ user, workspace, permission: 'Read' })
    const assignment2 = WorkspaceAssignment.create({ user, workspace, permission: 'Read' })
    await assignment1.save()
    const shouldReject = assignment2.save()
    await expect(shouldReject).rejects.toThrow('SQLITE_CONSTRAINT: UNIQUE constraint failed: WorkspaceAssignment.userId, WorkspaceAssignment.workspaceId, WorkspaceAssignment.permission')
  })
})
