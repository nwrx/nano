import type { Schema } from '@nwrx/nano/utils'
import type { RegistryCategory, RegistryCollection } from '../entities'
import type { ModuleRegistry } from '../index'
import { components } from '../../../core/components'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { NATIVE_CATEGORIES } from './nativeCategories'
import { NATIVE_COLLECTIONS } from './nativeCollections'
import { NATIVE_COMPONENTS } from './nativeComponents'

/**
 * Initialize the registry collections with the initial collections. If the collections
 * already exist in the workspace, the function will skip creating them.
 *
 * @returns A promise that resolves when the initialization is complete.
 */
export async function initialize(this: ModuleRegistry) {
  return this.withTransaction(async() => {
    const moduleUser = this.getModule(ModuleUser)
    const moduleWorkspace = this.getModule(ModuleWorkspace)
    const allCategories = new Map<string, RegistryCategory>()
    const allCollections = new Map<string, RegistryCollection>()

    // --- Assert that the `nanoworks` user workspace exist. If not, create it.
    const { User } = moduleUser.getRepositories()
    let user = await User.findOneBy({ username: 'nanoworks' })
    const userNanoworks = User.create({ id: user?.id, username: 'nanoworks', email: 'contact@nanoworks.io' })
    user = await User.save(userNanoworks)

    // --- Assert that the `nanoworks` workspace exist. If not, create it.
    const { Workspace } = moduleWorkspace.getRepositories()
    let workspace = await Workspace.findOneBy({ name: 'nanoworks' })
    const workspaceNanoworks = Workspace.create({ id: workspace?.id, name: 'nanoworks', createdBy: user, isPublic: true })
    workspace = await Workspace.save(workspaceNanoworks)

    // --- For each initial category, check if it exists and create it if it does not.
    const { RegistryCategory } = this.getRepositories()
    for (const name in NATIVE_CATEGORIES) {
      const native = NATIVE_CATEGORIES[name as keyof typeof NATIVE_CATEGORIES]
      const existing = await RegistryCategory.findOneBy({ name })
      const category = RegistryCategory.create({ id: existing?.id, name, ...native })
      await RegistryCategory.save(category)
      allCategories.set(name, category)
    }

    // --- For each initial collection, check if it exists and create it if it does not.
    const { RegistryCollection } = this.getRepositories()
    for (const name in NATIVE_COLLECTIONS) {
      const native = NATIVE_COLLECTIONS[name as keyof typeof NATIVE_COLLECTIONS]
      const existing = await RegistryCollection.findOneBy({ name, workspace })
      const collection = RegistryCollection.create({ id: existing?.id, name, ...native, workspace, createdBy: user })
      await RegistryCollection.save(collection)
      allCollections.set(name, collection)
    }

    // --- For each initial component, check if it exists and create it if it does not.
    const { RegistryComponent } = this.getRepositories()
    for (const name in NATIVE_COMPONENTS) {
      const native = NATIVE_COMPONENTS[name as keyof typeof NATIVE_COMPONENTS]
      const collection = allCollections.get(native.collection)!
      const categories = native.categories.map(name => allCategories.get(name)!)
      const existing = await RegistryComponent.findOneBy({ name, collection })
      const inputs = components[name as keyof typeof components].inputs as Record<string, Schema>
      const outputs = components[name as keyof typeof components].outputs as Record<string, Schema>
      const component = RegistryComponent.create({ id: existing?.id, name, ...native, inputs, outputs, collection, categories, createdBy: user })
      await RegistryComponent.save(component)
    }
  })
}
