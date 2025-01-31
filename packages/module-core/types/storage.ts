import { defineType } from '@nwrx/nano'
import { assertFunction, createParser } from '@unshared/validation'

/** A function that performs a search operation in the storage. */
export type StorageSearch = (query: string) => Promise<string | undefined>

/** A function that reads data from the storage. */
export type StorageRead = (key: string) => Promise<string>

/** A function that writes data to the storage. */
export type StorageWrite = (key: string, value: string) => Promise<void>

/** A function that deletes data from the storage. */
export type StorageDelete = (key: string) => Promise<void>

export const storage = defineType({
  kind: 'storage',
  name: 'Storage',
  color: '#FF5733',
  description: 'An instance of a storage node with various operations.',
  parse: createParser({

    /**
     * The function that performs a search operation in the storage.
     *
     * @example query => storage.search(query)
     */
    search: assertFunction<StorageSearch>,

    /**
     * The function that reads data from the storage.
     *
     * @example key => storage.read(key)
     */
    read: assertFunction<StorageRead>,

    /**
     * The function that writes data to the storage.
     *
     * @example (key, value) => storage.write(key, value)
     */
    write: assertFunction<StorageWrite>,

    /**
     * The function that deletes data from the storage.
     *
     * @example key => storage.delete(key)
     */
    delete: assertFunction<StorageDelete>,
  }),
})
