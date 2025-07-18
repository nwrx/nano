import type { McpPoolObject } from '@nwrx/nano-api'
import type { McpPoolsFetchOptions } from './types'

export interface CreateMcpPoolsClientOptions {
  workspace: string
}

export function createMcpPoolsClient(parameters: CreateMcpPoolsClientOptions) {
  const { workspace } = parameters
  const client = useClient()
  const options = ref({}) as Ref<McpPoolsFetchOptions>
  const data = ref([]) as Ref<McpPoolObject[]>

  const fetchPools = async() => {
    await client.requestAttempt(
      'GET /api/workspaces/:workspace/pools',
      {
        parameters: { workspace },
        query: { ...options.value },
        onData: (poolsData) => { data.value = poolsData },
      },
    )
  }

  const createPool = async(name: string) => {
    await client.requestAttempt(
      'POST /api/workspaces/:workspace/pools',
      {
        parameters: { workspace },
        data: { name },
        onSuccess: () => fetchPools(),
      },
    )
  }

  return toReactive({
    data,
    options,
    fetchPools,
    createPool,
  })
}
