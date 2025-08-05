import type { ModuleRunner } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ILike } from 'typeorm'
import { assertUser, ModuleUser } from '../../user'

/** The parser function for the {@linkcode searchRunners} function. */
export const SEARCH_RUNNERS_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  search: [[assert.undefined], [assert.stringNotEmpty]],
  page: [[assert.undefined], [assert.numberInteger, assert.numberPositive]],
  limit: [[assert.undefined], [assert.numberInteger, assert.numberPositive]],
  sortBy: [[assert.undefined], [assert.stringEnum(['name', 'address', 'createdAt', 'updatedAt'])]],
  sortDirection: [[assert.undefined], [assert.stringEnum(['ASC', 'DESC'])]],
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withDisabledBy: [[assert.undefined], [assert.boolean]],
  withDeleted: [[assert.undefined], [assert.boolean]],
})

/** The options to search for the {@linkcode searchRunners} function. */
export type SearchRunnersOptions = ReturnType<typeof SEARCH_RUNNERS_OPTIONS_SCHEMA>

/**
 * Search for runners based on the provided options.
 * This function queries the database for runners that match the search criteria
 * and returns a paginated list of runners.
 *
 * @param options The options to search for runners.
 * @returns A list of runners that match the search criteria.
 */
export async function searchRunners(this: ModuleRunner, options = {} as SearchRunnersOptions) {
  const {
    user,
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'name',
    sortDirection = 'ASC',
    withCreatedBy = false,
    withUpdatedBy = false,
    withDisabledBy = false,
    withDeleted = false,
  } = SEARCH_RUNNERS_OPTIONS_SCHEMA(options)

  // --- Assert the user is a super administrator.
  const moduleUser = this.getModule(ModuleUser)
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

  // --- Get runners from the database.
  const { Runner } = this.getRepositories()
  return await Runner.find({
    where: search.length > 2
      ? [
        { name: ILike(`%${search}%`) },
        { address: ILike(`%${search}%`) },
      ]
      : {},
    take: limit,
    skip: (page - 1) * limit,
    order: { [sortBy]: sortDirection },
    withDeleted,
    relations: {
      createdBy: withCreatedBy,
      updatedBy: withUpdatedBy,
      disabledBy: withDisabledBy,
      deletedBy: withDeleted,
    },
  })
}
