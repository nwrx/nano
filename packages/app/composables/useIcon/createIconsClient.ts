import type { IconFetchOptions } from './types'

export function createIconsClient() {
  const client = useClient()

  // --- Create reactive references for data and options.
  const data = ref([]) as Ref<string[]>
  const options = ref<IconFetchOptions>({})

  const isSearching = ref(false)
  async function searchIcons(allowCache = false) {
    if (allowCache && data.value.length > 0) return
    options.value.page = 1
    isSearching.value = true
    await client.requestAttempt(
      'GET /api/icons',
      {
        query: { ...options.value },
        onData: (iconsData) => { data.value = iconsData },
        onEnd: () => isSearching.value = false,
      },
    )
  }

  async function loadMoreIcons() {
    options.value.page ??= 1
    options.value.page += 1
    await client.requestAttempt(
      'GET /api/icons',
      {
        query: { ...options.value },
        onData: (iconsData) => {
          data.value = [...data.value, ...iconsData]
        },
      },
    )
  }

  return toReactive({
    data,
    options,
    isSearching,
    searchIcons,
    loadMoreIcons,
  })
}
