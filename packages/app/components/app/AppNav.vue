<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n'
import type { Locales } from '~/utils/types'

const props = defineProps<{
  theme?: string
  title?: string
  imageUrl?: string
  items?: NavItem[]
  userEmail?: string
  userUsername?: string
  userDisplayName?: string
  search?: string
  searchOpen?: boolean
  locale?: Locales
  locales?: Array<LocaleObject & { icon: string }>
}>()

const emit = defineEmits<{
  signout: []
  setLocale: [language: Locales]
  setTheme: ['dark' | 'light']
}>()

// --- Search.
const search = useVModel(props, 'search', emit, { passive: true })
const searchOpen = useVModel(props, 'searchOpen', emit, { passive: true })

// --- Theme.
const theme = useVModel(props, 'theme', emit, {
  passive: false,
  defaultValue: 'light',
  eventName: 'setTheme',
})

// --- Language.
const locale = useVModel(props, 'locale', emit, {
  passive: false,
  defaultValue: 'en-US',
  eventName: 'setLocale',
}) as Ref<string>
</script>

<template>
  <header class="flex items-center justify-start w-full space-x-md">

    <!-- Title and logo -->
    <div class="flex items-center justify-center size-10">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        alt="Logo"
        class="size-8 rounded">
    </div>

    <NuxtLink
      to="/"
      class="text-sm font-medium font-mono lowercase ring-1.5 ring-white px-1.5">
      {{ title }}
    </NuxtLink>

    <!-- Spacer -->
    <div class="grow" />

    <!-- Search -->
    <AppNavSearch
      v-model="search"
      v-model:open="searchOpen"
      class="shrink-1"
    />

    <!-- Items - End -->
    <nav class="flex h-full items-center justify-end">
      <AppNavItem
        v-for="item in items"
        :key="item.label"
        :to="item.to"
        :label="item.label"
        class="w-full h-full px-xs"
      />
    </nav>

    <AppNavFab
      :icon="theme === 'dark' ? 'i-carbon:moon' : 'i-carbon:sunny'"
      @click="() => theme = theme === 'dark' ? 'light' : 'dark'"
    />

    <!-- Language -->
    <AppNavLanguage
      v-if="locales"
      v-model="locale"
      :locales="locales"
    />

    <!-- User -->
    <AppNavUser
      :email="userEmail"
      :username="userUsername"
      :display-name="userDisplayName"
      @signout="() => emit('signout')"
    />
  </header>
</template>
