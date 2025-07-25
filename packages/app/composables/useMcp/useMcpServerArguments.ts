import { createCachedComposable } from '../createCachedComposable'
import { createMcpServerArgumentsClient } from './createMcpServerArgumentsClient'

export const useMcpServerArguments = createCachedComposable(createMcpServerArgumentsClient, {
  cacheKey: ({ workspace, pool, name }) => [workspace, pool, name].join('/'),
})
