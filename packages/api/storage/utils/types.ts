import type {
  StoragePoolAzureOptions,
  StoragePoolFSOptions,
  StoragePoolGcsOptions,
  StoragePoolS3Options,
} from '../adapters'

export type StoragePoolConfiguration =
  | StoragePoolAzureOptions
  | StoragePoolFSOptions
  | StoragePoolGcsOptions
  | StoragePoolS3Options
