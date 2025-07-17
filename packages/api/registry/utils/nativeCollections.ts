import type { RegistryCollection } from '../entities'

export type NativeCollections = Record<string, Partial<RegistryCollection>>
export type NativeCollectionName = keyof typeof NATIVE_COLLECTIONS

export const NATIVE_COLLECTIONS = {
  core: {
    title: 'Core',
    icon: '/favicon-196x196.png',
    description: 'Core platform components.',
    isPublic: true,
  },
} as const satisfies NativeCollections
