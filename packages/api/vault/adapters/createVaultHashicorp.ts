import type { VaultAdapter } from './createVaultAdapter'
import { createVaultAdapter } from './createVaultAdapter'

export interface VaultHashicorpOptions {
  endpoint: string
  token: string
  namespace?: string
  path?: string
}

export interface VaultHashicorpData {
  created_time: string
  custom_metadata: unknown
  deletion_time: string
  destroyed: boolean
  version: number
}

async function handleFailure(response: Response, context: string) {
  const data = await response.json() as { errors?: string[]; warnings: string[] }
  let message = response.statusText
  if (data.warnings) message = data.warnings.join(', ')
  if (data.errors) message = data.errors.join(', ')
  return new Error(`${context}: ${message}`)
}

export function createVaultHashicorp(options: VaultHashicorpOptions): VaultAdapter<VaultHashicorpData> {
  const { endpoint, token, namespace, path = 'secret' } = options
  const headers = { 'X-Vault-Token': token, 'X-Vault-Namespace': namespace! }

  return createVaultAdapter({
    async initialize(): Promise<void> {
      const url = new URL('/v1/sys/health', endpoint)
      const response = await fetch(url, { headers: new Headers(headers) }).catch((error) => {
        const message = error instanceof Error ? error.message : 'Unknown error'
        throw new Error(`Failed to connect to HashiCorp Vault: ${message}`)
      })

      // --- Assert that the vault is initialized and unsealed.
      if (!response.ok) throw await handleFailure(response, 'Failed to initialize HashiCorp Vault')
      const data = await response.json() as { initialized: boolean; sealed: boolean }
      if (!data.initialized) throw new Error('HashiCorp Vault is not initialized')
      if (data.sealed) throw new Error('HashiCorp Vault is sealed')

      // --- Assert that the vault is accessible with the provided token.
      const url2 = new URL(`/v1/${path}/config`, endpoint)
      const response2 = await fetch(url2, { headers })
      if (!response2.ok) throw await handleFailure(response2, 'Failed to initialize access to HashiCorp Vault')
    },

    async setValue(variable, value): Promise<VaultHashicorpData> {
      const url = new URL(`/v1/${path}/data/${variable.name}`, endpoint)
      const body = JSON.stringify({ data: { value } })
      const response = await fetch(url, { method: 'POST', headers, body })
      if (!response.ok) throw await handleFailure(response, 'Failed to set value in HashiCorp Vault')
      const { data } = await response.json() as { data: VaultHashicorpData }
      variable.data = data
      return data
    },

    async getValue(variable): Promise<string> {
      const url = new URL(`/v1/${path}/data/${variable.name}`, endpoint)
      const response = await fetch(url, { headers })
      if (response.status === 404) throw new Error(`Failed to get value from HashiCorp Vault: Secret at key "${variable.name}" not found`)
      if (!response.ok) throw await handleFailure(response, 'Failed to get value from HashiCorp Vault')
      const result = await response.json() as { data: { data: { value: string }; metadata: VaultHashicorpData } }
      return result.data.data.value
    },

    async deleteValue(variable): Promise<void> {
      const url = new URL(`/v1/${path}/metadata/${variable.name}`, endpoint)
      const response = await fetch(url, { method: 'DELETE', headers })
      if (!response.ok) throw await handleFailure(response, 'Failed to delete value from HashiCorp Vault')
    },

    async listValues(): Promise<string[]> {
      const url = new URL(`/v1/${path}/metadata?list=true`, endpoint)
      const response = await fetch(url, { method: 'LIST', headers })
      if (!response.ok) throw await handleFailure(response, 'Failed to list values in HashiCorp Vault')
      const { data } = await response.json() as { data: { keys: string[] } }
      return data.keys
    },
  })
}
