import { createCachedComposable } from '../createCachedComposable'
import { createMcpServerVariablesClient } from './createMcpServerVariablesClient'

export const useMcpServerVariables = createCachedComposable(createMcpServerVariablesClient, {
  cacheKey: ({ workspace, pool, name }) => [workspace, pool, name].join('/'),
})
