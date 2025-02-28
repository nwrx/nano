import type { Schema } from '@nwrx/nano/utils'
import type { ModuleRegistry } from '../index'
import { In } from 'typeorm'
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

    // --- Assert that the `nanoworks` user workspace exist. If not, create it.
    const { User } = moduleUser.getRepositories()
    let createdBy = await User.findOneBy({ username: 'nanoworks' })
    const userNanoworks = User.create({ id: createdBy?.id, username: 'nanoworks', email: 'contact@nanoworks.io' })
    createdBy = await User.save(userNanoworks)

    // --- Assert that the `nanoworks` workspace exist. If not, create it.
    const { Workspace } = moduleWorkspace.getRepositories()
    let workspace = await Workspace.findOneBy({ name: 'nanoworks' })
    const workspaceNanoworks = Workspace.create({ id: workspace?.id, name: 'nanoworks', createdBy, isPublic: true })
    workspace = await Workspace.save(workspaceNanoworks)

    // --- For each initial category, check if it exists and create it if it does not.
    const { RegistryCategory } = this.getRepositories()
    for (const name in NATIVE_CATEGORIES) {
      const native = NATIVE_CATEGORIES[name as keyof typeof NATIVE_CATEGORIES]
      const existing = await RegistryCategory.findOneBy({ name })
      const category = RegistryCategory.create({ id: existing?.id, name, ...native })
      await RegistryCategory.save(category)
    }

    // --- For each initial collection, check if it exists and create it if it does not.
    const { RegistryCollection } = this.getRepositories()
    for (const name in NATIVE_COLLECTIONS) {
      const native = NATIVE_COLLECTIONS[name as keyof typeof NATIVE_COLLECTIONS]
      const existing = await RegistryCollection.findOneBy({ name, workspace })
      const collection = RegistryCollection.create({ id: existing?.id, name, ...native, workspace, createdBy })
      await RegistryCollection.save(collection)
    }

    // --- For each initial component, check if it exists and create it if it does not.
    const { RegistryComponent } = this.getRepositories()
    for (const name in NATIVE_COMPONENTS) {
      const native = NATIVE_COMPONENTS[name as keyof typeof NATIVE_COMPONENTS]
      const collection = await RegistryCollection.findOneByOrFail({ name: native.collection, workspace })
      const categories = await RegistryCategory.findBy({ name: In(native.categories) })
      const existing = await RegistryComponent.findOneBy({ name, collection })
      const inputs = components[name as keyof typeof components].inputs as Record<string, Schema>
      const outputs = components[name as keyof typeof components].outputs as Record<string, Schema>
      const component = RegistryComponent.create({ id: existing?.id, name, ...native, version: '1.0.0', inputs, outputs, collection, categories, createdBy })
      await RegistryComponent.save(component)
    }
  })
}
