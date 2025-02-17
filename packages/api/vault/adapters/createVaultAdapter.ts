import type { VaultVariable } from '../entities'

export enum VaultType {
  AWS = 'aws',
  Azure = 'azure',
  Bitwarden = 'bitwarden',
  Google = 'google',
  Hashicorp = 'hashicorp',
  Local = 'local',
}

export interface VaultAdapter<T extends object = object> {

  /**
   * Initialize the key vault connection and verify credentials
   */
  initialize(): Promise<void>

  /**
   * Store a secret in the key vault
   */
  setValue(variable: VaultVariable<T>, value: string): Promise<T>

  /**
   * Retrieve a secret from the key vault
   */
  getValue(variable: VaultVariable<T>): Promise<string>

  /**
   * Delete a secret from the key vault
   */
  deleteValue(variable: VaultVariable<T>): Promise<void>

  /**
   * List all secrets in the key vault
   */
  listValues(): Promise<string[]>
}

export function createVaultAdapter<T extends object = object>(options: VaultAdapter<T>): VaultAdapter<T> {
  return options
}
