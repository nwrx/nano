import { defineNode } from '@nwrx/core'
import { categoryStorage } from '../categories'
import { boolean, storageInstance, string } from '../types'

/** The symbol used to store the memory storage instances in the flow context. */
const STORAGE_MEMORY_SYMBOL = Symbol.for('STORAGE_MEMORY')

declare module '@nwrx/core' {
  interface FlowContext {
    [STORAGE_MEMORY_SYMBOL]: Record<string, Record<string, string>>
  }
}

export const storageMemory = defineNode({
  kind: 'storage-memory',
  name: 'Memory Storage',
  icon: 'https://api.iconify.design/carbon:save.svg',
  description: 'An in-memory storage instance with various operations.',
  category: categoryStorage,

  // --- Define the inputs of the node.
  dataSchema: {
    name: {
      type: string,
      name: 'Name',
      control: 'text',
      description: 'The name of the memory storage instance.',
    },
  },

  // --- Define the outputs of the node.
  resultSchema: {
    instance: {
      type: storageInstance,
      name: 'Instance',
      description: 'The in-memory storage instance.',
      isOptional: true,
    },
  },

  // --- On processing the node, create an in-memory storage instance.
  process: ({ data, flow }) => {
    const { name } = data

    // --- Create an in-memory storage instance.
    const memoryStorage: Record<string, string> = {}
    flow.context[STORAGE_MEMORY_SYMBOL] = flow.context[STORAGE_MEMORY_SYMBOL] || {}
    flow.context[STORAGE_MEMORY_SYMBOL][name] = memoryStorage

    // --- Define the storage instance.
    const instance = {
      search: (query: string) => {
        let result: string | undefined
        for (const key in memoryStorage) {
          if (!memoryStorage[key].includes(query)) continue
          result = memoryStorage[key]
          break
        }
        return Promise.resolve(result)
      },
      read: (key: string) => {
        const value = memoryStorage[key]
        return Promise.resolve(value)
      },
      write: (key: string, value: string) => {
        memoryStorage[key] = value
        return Promise.resolve()
      },
      delete: (key: string) => {
        delete memoryStorage[key]
        return Promise.resolve()
      },
    }

    return { instance }
  },
})

export const storageSearch = defineNode({
  kind: 'storage-search',
  name: 'Storage / Search',
  icon: 'https://api.iconify.design/carbon:search.svg',
  description: 'Searches for data in a storage instance.',
  category: categoryStorage,

  // --- Define the inputs of the node.
  dataSchema: {
    instance: {
      type: storageInstance,
      name: 'Instance',
      description: 'The storage instance to search in.',
    },
    query: {
      type: string,
      name: 'Query',
      description: 'The query to search for in the storage instance.',
    },
  },

  // --- Define the outputs of the node.
  resultSchema: {
    result: {
      type: string,
      name: 'Result',
      description: 'The result of the search operation.',
      isOptional: true,
    },
  },

  // --- On processing the node, search for data in the storage instance.
  process: async({ data }) => {
    const { instance, query } = data
    return { result: await instance.search(query) }
  },
})

export const storageWrite = defineNode({
  kind: 'storage-write',
  name: 'Storage / Write',
  icon: 'https://api.iconify.design/carbon:save.svg',
  description: 'Writes data to a storage instance.',
  category: categoryStorage,

  // --- Define the inputs of the node.
  dataSchema: {
    instance: {
      type: storageInstance,
      name: 'Instance',
      description: 'The storage instance to write to.',
    },
    key: {
      type: string,
      name: 'Key',
      control: 'text',
      description: 'The key to write the data to in the storage instance.',
    },
    value: {
      type: string,
      name: 'Value',
      control: 'text',
      description: 'The value to write to the storage instance.',
    },
  },

  // --- Define the outputs of the node.
  resultSchema: {
    success: {
      type: boolean,
      name: 'Success',
      description: 'Whether the write operation was successful.',
    },
    failure: {
      type: boolean,
      name: 'Failure',
      description: 'Whether the write operation failed.',
    },
  },

  // --- On processing the node, write data to the storage instance.
  process: async({ data }) => {
    const { instance, key, value } = data
    return await instance.write(key, value)
      .then(() => ({ success: true, failure: false }))
      .catch(() => ({ success: false, failure: true }))
  },
})
