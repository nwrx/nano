import { createCachedComposable } from '../createCachedComposable'
import { createMcpServerClient } from './createMcpServerClient'

export const useMcpServer = createCachedComposable(createMcpServerClient, {
  cacheKey: ({ workspace, pool, name }) => [workspace, pool, name].join('/'),
})
