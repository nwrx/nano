import type { Loose } from '@unshared/types'
import type { FindOptionsWhere } from 'typeorm'
import type { Project } from '../entities'
import type { ModuleProject } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ILike, In } from 'typeorm'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'

/** The parser function for the `searchProjects` function. */
export const SEARCH_PROJECTS_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  user: [[assert.undefined], [assertUser]],
  search: [[assert.undefined], [assert.string]],
  page: [[assert.undefined], [assert.number]],
  limit: [[assert.undefined], [assert.number]],
  sortBy: [[assert.undefined], [assert.stringEnum(['name', 'title', 'createdAt', 'updatedAt'])]],
  sortDirection: [[assert.undefined], [assert.stringEnum(['ASC', 'DESC'])]],
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withDeleted: [[assert.undefined], [assert.boolean]],
})

/** The options to search for projects. */
export type SearchProjectsOptions = Loose<ReturnType<typeof SEARCH_PROJECTS_OPTIONS_SCHEMA>>

/**
 * Search for the `Project` with the given name. The function will query the database
 * for the project with the given name and assert that the user has access to the project.
 * If the project is not found or the user does not have access to the project, the function
 * will throw an error.
 *
 * @param options The options to find the project with.
 * @returns The `Project` with the given name.
 */
export async function searchProjects(this: ModuleProject, options: SearchProjectsOptions): Promise<Project[]> {
  const {
    search = '',
    user,
    workspace,
    page = 1,
    limit = 10,
    sortBy = 'name',
    sortDirection = 'ASC',
    withCreatedBy = false,
    withUpdatedBy = false,
    withDeleted = false,
  } = SEARCH_PROJECTS_OPTIONS_SCHEMA(options)

  // --- Get the repositories to query the database.
  const { Project } = this.getRepositories()
  const searchSafe = search.replaceAll(/[^\d\sa-z]/gi, '')
  const searchOperator = searchSafe.length > 2 ? ILike(`%${searchSafe}%`) : undefined

  // --- Search for all public projects within public workspaces.
  const where: Array<FindOptionsWhere<Project>> = [
    { name: searchOperator, workspace, isPublic: true },
    { title: searchOperator, workspace, isPublic: true },
  ]

  // --- If a user is provided, also search for projects the user has access to.
  if (user) {
    where.push(
      { name: searchOperator, workspace, assignments: { user, permission: In(['Owner', 'Read']) } },
      { title: searchOperator, workspace, assignments: { user, permission: In(['Owner', 'Read']) } },
    )
  }

  // --- If the project is not found, throw an error.
  return await Project.find({
    where,
    order: { [sortBy]: sortDirection },
    take: limit,
    skip: (page - 1) * limit,
    withDeleted,
    relations: {
      createdBy: withCreatedBy,
      updatedBy: withUpdatedBy,
      deletedBy: withDeleted,
    },
  })
}
