import { createCachedComposable } from '../createCachedComposable'
import { createIconCollectionsClient } from './createIconCollectionsClient'

export const useIconCollections = createCachedComposable(createIconCollectionsClient, {
  cacheKey: () => 'default',
  isPersistent: true,
})
