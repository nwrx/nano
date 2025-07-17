import type { IconCollectionObject } from '@nwrx/nano-api'

export function getIconCollectionStatusBadge(collection: IconCollectionObject) {
  if (collection.disabledAt) return 'badge-warning'
  if (collection.status === 'Installed') return 'badge-success'
  if (collection.status === 'Installing') return 'badge-warning'
  if (collection.status === 'NotInstalled') return ''
  if (collection.status === 'Outdated') return 'badge-warning'
  return ''
}
