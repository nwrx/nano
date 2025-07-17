import type { IconCollectionObject } from '@nwrx/nano-api'

export function getIconCollectionStatusIcon(collection: IconCollectionObject) {
  if (collection.disabledAt) return 'i-carbon:pause'
  if (collection.status === 'Installed') return 'i-carbon:checkmark-filled'
  if (collection.status === 'Installing') return 'i-line-md:loading-loop'
  if (collection.status === 'NotInstalled') return 'i-carbon:close'
  if (collection.status === 'Outdated') return 'i-carbon:warning-filled'
  return 'i-carbon:circle-dash'
}
