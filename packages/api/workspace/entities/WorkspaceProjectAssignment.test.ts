/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ModuleUser } from '@nwrx/api/user'
import { EXP_UUID } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { ModuleWorkspace } from '../index'

const { application, reset, destroy } = await createTestContext()
const { Workspace, WorkspaceProject, WorkspaceProjectAssignment } = application.getModule(ModuleWorkspace).entities
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

describe('initialization', () => {
  it('should create a new project assignment', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'john-doe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const project = await WorkspaceProject.create({ name: 'my-workspace', workspace }).save()
    const assignment = await WorkspaceProjectAssignment.create({ user, project, permission: 'Owner' }).save()
    const assignmentDatabase = await WorkspaceProjectAssignment.findOne({
      where: { id: assignment.id },
      relations: { user: true, project: true },
    })
    expect(assignmentDatabase).toBeInstanceOf(WorkspaceProjectAssignment)
    expect(assignmentDatabase).toMatchObject({
      id: expect.stringMatching(EXP_UUID),
      user: { id: user.id },
      project: { id: project.id },
      createdAt: new Date('2000-01-01T00:00:00Z'),
      updatedAt: new Date('2000-01-01T00:00:00Z'),
      deletedAt: undefined,
    })
  })

  it('should create multiple assignments for the same user and project', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const project = await WorkspaceProject.create({ name: 'my-workspace', workspace }).save()
    await WorkspaceProjectAssignment.create({ user, project, permission: 'Read' }).save()
    await WorkspaceProjectAssignment.create({ user, project, permission: 'Write' }).save()
    const assignments = await WorkspaceProjectAssignment.find()
    expect(assignments).toHaveLength(2)
  })

  it('should create multiple assignments for different users and the same project', async() => {
    const user1 = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const user2 = await User.create({ email: 'paul.doe@acme.com', username: 'pdoe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const project = await WorkspaceProject.create({ name: 'my-workspace', workspace }).save()
    await WorkspaceProjectAssignment.create({ user: user1, project, permission: 'Read' }).save()
    await WorkspaceProjectAssignment.create({ user: user2, project, permission: 'Write' }).save()
    const assignments = await WorkspaceProjectAssignment.find()
    expect(assignments).toHaveLength(2)
  })
})

describe('cascade', () => {
  it('should delete the project assignments when the project is deleted', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const project = await WorkspaceProject.create({ name: 'my-workspace', workspace }).save()
    await WorkspaceProjectAssignment.create({ user, project, permission: 'Read' }).save()
    await WorkspaceProjectAssignment.create({ user, project, permission: 'Write' }).save()
    await project.remove()
    const assignments = await WorkspaceProjectAssignment.find()
    expect(assignments).toHaveLength(0)
  })

  it('should delete the project assignments when the user is deleted', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const project = await WorkspaceProject.create({ name: 'my-workspace', workspace }).save()
    await WorkspaceProjectAssignment.create({ user, project, permission: 'Read' }).save()
    await WorkspaceProjectAssignment.create({ user, project, permission: 'Write' }).save()
    await user.remove()
    const assignments = await WorkspaceProjectAssignment.find()
    expect(assignments).toHaveLength(0)
  })
})

describe('edge cases', () => {
  it('should throw an error if the user is not defined', async() => {
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const project = await WorkspaceProject.create({ name: 'my-workspace', workspace }).save()
    const assignment = WorkspaceProjectAssignment.create({ project, permission: 'Read' })
    const shouldReject = assignment.save()
    await expect(shouldReject).rejects.toThrow('SQLITE_CONSTRAINT: NOT NULL constraint failed: WorkspaceProjectAssignment.userId')
  })

  it('should throw an error if the project is not defined', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const assignment = WorkspaceProjectAssignment.create({ user, permission: 'Read' })
    const shouldReject = assignment.save()
    await expect(shouldReject).rejects.toThrow('SQLITE_CONSTRAINT: NOT NULL constraint failed: WorkspaceProjectAssignment.projectId')
  })

  it('should throw an error if the permission is not defined', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const project = await WorkspaceProject.create({ name: 'my-workspace', workspace }).save()
    const assignment = WorkspaceProjectAssignment.create({ user, project })
    const shouldReject = assignment.save()
    await expect(shouldReject).rejects.toThrow('SQLITE_CONSTRAINT: NOT NULL constraint failed: WorkspaceProjectAssignment.permission')
  })

  it('should throw an error on duplicate assignments', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const project = await WorkspaceProject.create({ name: 'my-workspace', workspace }).save()
    const assignment1 = WorkspaceProjectAssignment.create({ user, project, permission: 'Read' })
    const assignment2 = WorkspaceProjectAssignment.create({ user, project, permission: 'Read' })
    await assignment1.save()
    const shouldReject = assignment2.save()
    await expect(shouldReject).rejects.toThrow('SQLITE_CONSTRAINT: UNIQUE constraint failed: WorkspaceProjectAssignment.userId, WorkspaceProjectAssignment.projectId, WorkspaceProjectAssignment.permission')
  })
})
