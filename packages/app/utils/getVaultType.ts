/* eslint-disable sonarjs/no-commented-code */
import type { VaultType } from '@nwrx/nano-api'

export function getVaultTypeIcon(type: VaultType) {
  if (type === 'hashicorp') return 'i-simple-icons:hashicorp'
  if (type === 'aws') return 'i-simple-icons:awssecretsmanager'
  // if (type === 'gcp') return 'i-simple-icons:googlecloud'
  if (type === 'azure') return 'i-simple-icons:microsoftazure'
  return 'i-carbon:locked'
}

export function getVaultTypeName(type: VaultType) {
  if (type === 'hashicorp') return 'HashiCorp Vault'
  if (type === 'aws') return 'AWS Secrets Manager'
  // if (type === 'gcp') return 'Google Cloud Secrets Manager'
  if (type === 'azure') return 'Azure Key Vault'
  if (type === 'local') return 'Local Vault'
  return 'Unknown Vault Type'
}
