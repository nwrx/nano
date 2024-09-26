import type { FindOptionsRelations } from 'typeorm'
import type { User } from '../entities'
import type { ModuleUser } from '../index'

/**
 * Given a `userName`, return the associated `User` entity if it exists.
 *
 * @param username The username of the user to resolve.
 * @param relations The relations to load with the user.
 * @returns The resolved user entity.
 * @example const user = await resolveUser('john_doe') // User { ... }
 */
export async function resolveUser(this: ModuleUser, username: string, relations?: FindOptionsRelations<User>): Promise<User> {
  const { User } = this.getRepositories()

  // --- Find the user by the username.
  const user = await User.findOne({
    where: { username },
    relations,
  })

  // --- Throw an error if the user does not exist.
  if (!user) throw this.errors.USER_NOT_FOUND(username)
  return user
}
