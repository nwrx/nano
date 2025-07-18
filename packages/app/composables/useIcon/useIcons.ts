import { createCachedComposable } from '../createCachedComposable'
import { createIconsClient } from './createIconsClient'

export const useIcons = createCachedComposable(createIconsClient, {
  cacheKey: () => 'default',
  isPersistent: true,
})
