import type { RegistryCategoryObject, RegistryCollectionObject } from '@nwrx/nano-api'

export const useRegistryExplorer = createSharedComposable(() => {
  const client = useClient()
  const search = ref<string>()
  const categories = ref<RegistryCategoryObject[]>([])
  const collections = ref<RegistryCollectionObject[]>([])
  const selectedCategory = ref<RegistryCategoryObject>()

  const searchCategories = async() => {
    await client.requestAttempt('GET /registry/categories', {
      data: {
        search: search.value,
        limit: 100,
      },
      onData: (data) => {
        categories.value = data
      },
    })
  }

  const searchCollections = async() => {
    await client.requestAttempt('GET /registry/collections', {
      data: {
        limit: 100,
        withComponents: true,
        withCategories: true,
        withWorkspace: true,
      },
      onData: (data) => {
        collections.value = data
      },
    })
  }

  return {
    search,
    categories,
    collections,
    selectedCategory,
    searchCategories,
    searchCollections,
  }
})
