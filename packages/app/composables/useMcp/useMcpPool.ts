import { createCachedComposable } from '../createCachedComposable'
import { createMcpPoolClient } from './createMcpPoolClient'

export const useMcpPool = createCachedComposable(createMcpPoolClient, {
  cacheKey: ({ workspace, pool }) => [workspace, pool].join('/'),
})
