import type { IconCollectionObject } from '@nwrx/nano-api'

export function getIconCollectionStatusColor(collection: IconCollectionObject) {
  if (collection.disabledAt) return 'text-warning'
  if (collection.status === 'Installed') return 'text-success'
  if (collection.status === 'Installing') return 'text-warning'
  if (collection.status === 'NotInstalled') return 'text-subtle'
  if (collection.status === 'Outdated') return 'text-warning'
  return 'text-subtle'
}
