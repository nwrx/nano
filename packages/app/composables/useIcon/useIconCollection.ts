import { createCachedComposable } from '../createCachedComposable'
import { createIconCollectionClient } from './createIconCollectionClient'

export const useIconCollection = createCachedComposable(createIconCollectionClient, {
  cacheKey: ({ name }) => name,
})
