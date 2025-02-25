import type { Loose } from '@unshared/types'
import type { RegistryCategory } from '../entities'
import type { ModuleRegistry } from '../index'
import { assert, createSchema } from '@unshared/validation'

const GET_REGISTRY_CATEGORY_OPTIONS = createSchema({
  name: assert.stringNotEmpty,
})

/** The options to retrieve the registry category with. */
export type GetRegistryCategoryOptions = Loose<ReturnType<typeof GET_REGISTRY_CATEGORY_OPTIONS>>

/**
 * Get a registry category by its name. If the category is not found, the function will
 * throw an error.
 *
 * @param options The options to find the registry category with.
 * @returns The registry category if found.
 */
export async function getRegistryCategory(this: ModuleRegistry, options: GetRegistryCategoryOptions): Promise<RegistryCategory> {
  const { name } = GET_REGISTRY_CATEGORY_OPTIONS(options)
  const { RegistryCategory } = this.getRepositories()

  // --- Get the category.
  const category = await RegistryCategory.findOneBy({ name })
  if (!category) throw this.errors.REGISTRY_CATEGORY_NOT_FOUND(name)
  return category
}
