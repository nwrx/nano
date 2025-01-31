/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ModuleUser } from '@nwrx/api/user'
import { EXP_UUID } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { ModuleWorkspace } from '../index'

const { application, reset, destroy } = await createTestContext()
const { Workspace, WorkspaceProject, WorkspaceAssignment } = application.getModule(ModuleWorkspace).entities
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
  it('should create a new workspace', async() => {
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const workspaceDatabase = await Workspace.findOne({
      where: { id: workspace.id },
      relations: { assignments: true, projects: true },
    })
    expect(workspaceDatabase).toBeInstanceOf(Workspace)
    expect(workspaceDatabase).toMatchObject({
      id: expect.stringMatching(EXP_UUID),
      name: 'my-workspace',
      projects: [],
      assignments: [],
      createdAt: new Date('2000-01-01T00:00:00Z'),
      updatedAt: new Date('2000-01-01T00:00:00Z'),
      deletedAt: undefined,
    })
  })

  it('should create a new workspace with projects', async() => {
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const project1 = await WorkspaceProject.create({ name: 'my-project-1', title: 'My Project 1', workspace }).save()
    const project2 = await WorkspaceProject.create({ name: 'my-project-2', title: 'My Project 2', workspace }).save()
    const workspaceDatabase = await Workspace.findOne({
      where: { id: workspace.id },
      relations: { projects: { workspace: true } },
    })
    expect(workspaceDatabase).toBeInstanceOf(Workspace)
    expect(workspaceDatabase).toMatchObject({
      id: expect.stringMatching(EXP_UUID),
      name: 'my-workspace',
      projects: expect.arrayContaining([project1, project2]),
    })
  })

  it('should create a new workspace with assignments', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const assignment1 = await WorkspaceAssignment.create({ user, workspace, permission: 'Read' }).save()
    const assignment2 = await WorkspaceAssignment.create({ user, workspace, permission: 'Write' }).save()
    const workspaceDatabase = await Workspace.findOne({
      where: { id: workspace.id },
      relations: { assignments: { user: true, workspace: true },
      },
    })
    const assignmentIds = workspaceDatabase?.assignments.map(assignment => assignment.id)
    expect(assignmentIds).toContain(assignment1.id)
    expect(assignmentIds).toContain(assignment2.id)
  })
})

describe('cascade', () => {
  it('should not delete the workspace when the workspace assignments are deleted', async() => {
    const user = await User.create({ email: 'john.doe@acme.com', username: 'jdoe' }).save()
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const assignment = await WorkspaceAssignment.create({ user, workspace, permission: 'Read' }).save()
    await assignment.remove()
    const workspaceDatabase = await Workspace.findOne({
      where: { id: workspace.id },
      relations: { assignments: true },
    })
    expect(workspaceDatabase).toBeInstanceOf(Workspace)
    expect(workspaceDatabase).toMatchObject({
      id: expect.stringMatching(EXP_UUID),
      name: 'my-workspace',
      assignments: [],
    })
  })

  it('should not delete the workspace when the workspace projects are deleted', async() => {
    const workspace = await Workspace.create({ name: 'my-workspace' }).save()
    const project = await WorkspaceProject.create({ name: 'my-project', title: 'My Project', workspace }).save()
    await project.remove()
    const workspaceDatabase = await Workspace.findOne({
      where: { id: workspace.id },
      relations: { projects: true },
    })
    expect(workspaceDatabase).toBeInstanceOf(Workspace)
    expect(workspaceDatabase).toMatchObject({
      id: expect.stringMatching(EXP_UUID),
      name: 'my-workspace',
      projects: [],
    })
  })
})

describe('assignmentsByUser', () => {
  it('should return the assignments grouped by user', () => {
    const user1 = User.create({ email: 'john.doe@acme.com', username: 'jdoe', firstName: 'John', lastName: 'Doe' })
    const user2 = User.create({ email: 'paul.doe@acme.com', username: 'pdoe', firstName: 'Paul', lastName: 'Doe' })
    const assignment1 = WorkspaceAssignment.create({ user: user1, permission: 'Read' })
    const assignment2 = WorkspaceAssignment.create({ user: user1, permission: 'Write' })
    const assignment3 = WorkspaceAssignment.create({ user: user2, permission: 'Read' })
    const workspace = Workspace.create({ name: 'my-workspace', assignments: [assignment1, assignment2, assignment3] })
    expect(workspace.permissions).toStrictEqual([
      { user: expect.objectContaining({ id: user1.id }), permissions: ['Read', 'Write'] },
      { user: expect.objectContaining({ id: user2.id }), permissions: ['Read'] },
    ])
  })

  it('should not return the assignments if the assignments are not provided', () => {
    const workspace = Workspace.create({ name: 'my-workspace' })
    expect(workspace.permissions).toBeUndefined()
  })
})

describe('serialize', () => {
  it('should serialize the workspace', () => {
    const workspace = Workspace.create({ name: 'my-workspace' })
    const serialized = workspace.serialize()
    expect(serialized).toMatchObject({
      id: expect.stringMatching(EXP_UUID),
      name: 'my-workspace',
    })
  })

  it('should serialize the workspace with projects', () => {
    const project1 = WorkspaceProject.create({ name: 'my-project-1', title: 'My Project 1' })
    const project2 = WorkspaceProject.create({ name: 'my-project-2', title: 'My Project 2' })
    const workspace = Workspace.create({ name: 'my-workspace', projects: [project1, project2] })
    const serialized = workspace.serialize()
    expect(serialized).toMatchObject({
      name: 'my-workspace',
      projects: [
        { name: 'my-project-1', title: 'My Project 1' },
        { name: 'my-project-2', title: 'My Project 2' },
      ],
    })
  })

  it('should serialize the workspace with assignments grouped by user', () => {
    const user1 = User.create({ email: 'john.doe@acme.com', username: 'jdoe', firstName: 'John', lastName: 'Doe' })
    const user2 = User.create({ email: 'paul.doe@acme.com', username: 'pdoe', firstName: 'Paul', lastName: 'Doe' })
    const assignment1 = WorkspaceAssignment.create({ user: user1, permission: 'Read' })
    const assignment2 = WorkspaceAssignment.create({ user: user1, permission: 'Write' })
    const assignment3 = WorkspaceAssignment.create({ user: user2, permission: 'Read' })
    const workspace = Workspace.create({ name: 'my-workspace', assignments: [assignment1, assignment2, assignment3] })
    const serialized = workspace.serialize()
    expect(serialized).toMatchObject({
      name: 'my-workspace',
      assignments: [
        { user: { username: 'jdoe', displayName: 'John Doe' }, permissions: ['Read', 'Write'] },
        { user: { username: 'pdoe', displayName: 'Paul Doe' }, permissions: ['Read'] },
      ],
    })
  })
})

describe('edge cases', () => {
  it('should throw an error if the workspace name is not provided', async() => {
    const shouldReject = Workspace.create().save()
    await expect(shouldReject).rejects.toThrow('SQLITE_CONSTRAINT: NOT NULL constraint failed: Workspace.name')
  })

  it('should throw an error if the workspace name is not unique', async() => {
    await Workspace.create({ name: 'my-workspace' }).save()
    const shouldReject = Workspace.create({ name: 'my-workspace' }).save()
    await expect(shouldReject).rejects.toThrow('SQLITE_CONSTRAINT: UNIQUE constraint failed: Workspace.name')
  })
})
