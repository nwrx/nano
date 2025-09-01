import type { VaultVariable } from '../entities'

/**
 * Interface for a vault adapter that provides methods to interact with a key vault.
 * This interface defines the methods for initializing the vault connection,
 * setting, getting, deleting, and listing secrets.
 *
 * @template T
 * The type of the configuration object for the vault adapter. This will be stored
 * in the vault and will be encrypted in the database.
 */
export interface VaultAdapter<T extends object = object> {

  /**
   * Initialize the key vault connection and verify credentials
   */
  initialize(): Promise<void>

  /**
   * Store a secret in the key vault
   */
  setValue(variable: VaultVariable, value: string): Promise<T>

  /**
   * Retrieve a secret from the key vault
   */
  getValue(variable: VaultVariable): Promise<string>

  /**
   * Delete a secret from the key vault
   */
  deleteValue(variable: VaultVariable): Promise<void>

  /**
   * List all secrets in the key vault
   */
  listValues(): Promise<string[]>
}

export function createVaultAdapter<T extends object = object>(options: VaultAdapter<T>): VaultAdapter<T> {
  return options
}
