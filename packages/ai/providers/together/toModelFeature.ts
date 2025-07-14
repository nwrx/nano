/* eslint-disable sonarjs/no-commented-code */
import type { ProviderFeatureName } from '../../utils'
import type { Together } from './types'

export function toModelFeature(type: Together.ModelType): ProviderFeatureName[] {
  if (type === 'chat') return ['chat']
  if (type === 'embedding') return ['embeddings']
  if (type === 'image') return ['image']
  if (type === 'audio') return ['speech']
  if (type === 'transcribe') return ['transcript']
  // if (type === 'rerank') return 'unknown'
  // if (type === 'language') return 'unknown'
  // if (type === 'moderation') return 'unknown'
  return []
}
