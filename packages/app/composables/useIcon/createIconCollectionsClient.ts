import type { IconCollectionObject } from '@nwrx/nano-api'
import type { IconCollectionSearchOptions } from './types'

export function createIconCollectionsClient() {
  const client = useClient()
  const alerts = useAlerts()

  // --- Create reactive references for data and options.
  const data = ref([]) as Ref<IconCollectionObject[]>
  const options = ref<IconCollectionSearchOptions>({})

  const isSearching = ref(false)
  async function searchCollections(allowCache = false) {
    if (allowCache && data.value.length > 0) return
    options.value.page = 1
    isSearching.value = true
    await client.requestAttempt(
      'GET /api/icons/collections',
      {
        query: { ...options.value },
        onData: (collectionsData) => { data.value = collectionsData },
        onEnd: () => isSearching.value = false,
      },
    )
  }

  async function loadMoreCollections() {
    options.value.page ??= 1
    options.value.page += 1
    await client.requestAttempt(
      'GET /api/icons/collections',
      {
        query: { ...options.value },
        onData: (collectionsData) => {
          data.value = [...data.value, ...collectionsData]
        },
      },
    )
  }

  async function refreshCollections() {
    await client.requestAttempt(
      'POST /api/icons/collections/refresh',
      {
        onSuccess: async() => {
          alerts.success(localize({
            en: 'Icon collections have been refreshed successfully.',
            fr: 'Les collections d\'icônes ont été rafraîchies avec succès.',
            de: 'Die Icon-Sammlungen wurden erfolgreich aktualisiert.',
            es: 'Las colecciones de iconos se han actualizado correctamente.',
            zh: '图标集合已成功刷新。',
          }))
          await searchCollections()
        },
      },
    )
  }

  let subscribers = 0
  let abortController = new AbortController()

  function subscribeToEvents() {
    subscribers += 1
    void client.requestAttempt(
      'GET /api/icons/collections/events',
      {
        signal: abortController.signal,
        onData: ({ data: event }) => {
          if (event.event === 'installStart') {
            const collection = data.value.find(c => c.name === event.collection)
            if (!collection) return
            collection.status = 'Installing'
            data.value = [...data.value]
          }
          else if (event.event === 'installDone') {
            const collection = data.value.find(c => c.name === event.collection)
            if (!collection) return
            collection.status = 'Installed'
            data.value = [...data.value]
          }
          else if (event.event === 'enabled') {
            const collection = data.value.find(c => c.name === event.collection)
            if (!collection) return
            collection.disabledAt = undefined
            data.value = [...data.value]
          }
          else if (event.event === 'disabled') {
            const collection = data.value.find(c => c.name === event.collection)
            if (!collection) return
            collection.disabledAt = new Date().toISOString()
            data.value = [...data.value]
          }
          else if (event.event === 'installIconStart') {
            const collection = data.value.find(c => c.name === event.collection)
            if (!collection) return
            collection.status = 'Installing'
            collection.iconCountInstalled = event.currentIcon
            data.value = [...data.value]
          }
          else if (event.event === 'installIconDone') {
            const collection = data.value.find(c => c.name === event.collection)
            if (!collection) return
            collection.iconCountInstalled = event.currentIcon
            data.value = [...data.value]
          }
          else if (event.event === 'uninstalled') {
            const collection = data.value.find(c => c.name === event.collection)
            if (!collection) return
            collection.status = 'NotInstalled'
            data.value = [...data.value]
          }
        },
        onEnd: () => {
          subscribers = 0
        },
      },
    )
  }

  function unsubscribeFromEvents() {
    subscribers -= 1
    if (subscribers <= 0) {
      abortController.abort()
      abortController = new AbortController()
    }
  }

  return toReactive({
    data,
    options,
    isSearching,
    searchCollections,
    loadMoreCollections,
    refreshCollections,
    subscribeToEvents,
    unsubscribeFromEvents,
  })
}
