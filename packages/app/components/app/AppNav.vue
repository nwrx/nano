<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n'

const props = defineProps<{
  theme?: string
  title?: string
  imageUrl?: string
  itemsStart?: NavItem[]
  itemsEnd?: NavItem[]
  userAvatarUrl?: string
  userEmail?: string
  userDisplayName?: string
  search?: string
  searchOpen?: boolean
  locale?: string
  locales?: Array<{ icon: string } & LocaleObject>
}>()

const emit = defineEmits<{
  signout: []
  setLocale: [language: string]
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
  defaultValue: 'en',
  eventName: 'setLocale',
}) as Ref<string>
</script>

<template>
  <header class="flex items-center justify-start w-full space-x-md">

    <!-- Title and logo -->
    <div class="flex items-center space-x-sm">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        alt="Logo"
        class="size-8 rounded"
      />

      <h1 class="text-sm font-medium font-mono lowercase">
        {{ title }}
      </h1>
    </div>

    <!-- Items - Start -->
    <nav class="flex h-full items-center grow">
      <AppNavItem
        v-for="item in itemsStart"
        :key="item.label"
        :to="item.to"
        :label="item.label"
        class="w-full h-full px-xs"
      />
    </nav>

    <!-- Search -->
    <AppNavSearch
      v-model="search"
      v-model:open="searchOpen"
      class="shrink-1"
    />

    <!-- Items - End -->
    <nav class="flex h-full items-center justify-end">
      <AppNavItem
        v-for="item in itemsEnd"
        :key="item.label"
        :to="item.to"
        :label="item.label"
        class="w-full h-full px-xs"
      />
    </nav>

    <!-- Theme switch -->
    <div>
      <BaseIcon
        :icon="theme === 'dark' ? 'i-carbon:moon' : 'i-carbon:sunny'"
        class="cursor-pointer text-subtle hover:text-app transition"
        @click="() => theme = theme === 'dark' ? 'light' : 'dark'"
      />
    </div>

    <!-- Language -->
    <AppNavLanguage
      v-if="locales"
      v-model="locale"
      :locales="locales"
    />

    <!-- User -->
    <AppNavUser
      :avatarUrl="userAvatarUrl"
      :email="userEmail"
      :displayName="userDisplayName"
      @signout="() => emit('signout')"
    />
  </header>
</template>
