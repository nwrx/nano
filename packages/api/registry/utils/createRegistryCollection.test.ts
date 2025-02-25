import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { RegistryCollection } from '../entities'
import { createRegistryCollection } from './createRegistryCollection'

describe.concurrent<Context>('createRegistryCollection', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('result', (it) => {
    it('should create a collection', async({ setupUser, moduleRegistry }) => {
      const { user, workspace } = await setupUser()
      const collection = await createRegistryCollection.call(moduleRegistry, { name: 'collection', workspace, user })
      expect(collection).toBeInstanceOf(RegistryCollection)
      expect(collection).toMatchObject({
        name: 'collection',
        title: 'collection',
        workspace: { id: workspace.id },
        createdBy: { id: user.id },
      })
    })

    it('should create a collection with the given title', async({ setupUser, moduleRegistry }) => {
      const { user, workspace } = await setupUser()
      const collection = await createRegistryCollection.call(moduleRegistry, {
        name: 'collection',
        title: 'Collection',
        workspace,
        user,
      })
      expect(collection).toMatchObject({
        name: 'collection',
        title: 'Collection',
        workspace: { id: workspace.id },
        createdBy: { id: user.id },
      })
    })
  })

  describe<Context>('database', (it) => {
    it('should save the collection to the database', async({ setupUser, moduleRegistry }) => {
      const { user, workspace } = await setupUser()
      const collection = await createRegistryCollection.call(moduleRegistry, { name: 'collection', workspace, user })
      await moduleRegistry.getRepositories().RegistryCollection.save(collection)
      const count = await moduleRegistry.getRepositories().RegistryCollection.countBy({ name: 'collection' })
      expect(count).toBe(1)
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if the collection name is taken', async({ setupUser, moduleRegistry }) => {
      const { user, workspace } = await setupUser()
      const collection = await createRegistryCollection.call(moduleRegistry, { name: 'collection', workspace, user })
      await moduleRegistry.getRepositories().RegistryCollection.save(collection)
      const shouldReject = createRegistryCollection.call(moduleRegistry, { name: 'collection', workspace, user })
      const error = moduleRegistry.errors.REGISTRY_COLLECTION_NAME_TAKEN(workspace.name, 'collection')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw an error if the collection name is missing', async({ setupUser, moduleRegistry }) => {
      const { user, workspace } = await setupUser()
      // @ts-expect-error: testing missing `name` property
      const shouldReject = createRegistryCollection.call(moduleRegistry, { workspace, user })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the collection workspace is missing', async({ setupUser, moduleRegistry }) => {
      const { user } = await setupUser()
      // @ts-expect-error: testing missing `workspace` property
      const shouldReject = createRegistryCollection.call(moduleRegistry, { name: 'collection', user })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the collection user is missing', async({ setupUser, moduleRegistry }) => {
      const { workspace } = await setupUser()
      // @ts-expect-error: testing missing `user` property
      const shouldReject = createRegistryCollection.call(moduleRegistry, { name: 'collection', workspace })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })
  })
})
