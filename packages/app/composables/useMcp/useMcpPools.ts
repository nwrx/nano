import { createCachedComposable } from '../createCachedComposable'
import { createMcpPoolsClient } from './createMcpPoolsClient'

export const useMcpPools = createCachedComposable(createMcpPoolsClient, {
  cacheKey: ({ workspace }) => workspace,
})
