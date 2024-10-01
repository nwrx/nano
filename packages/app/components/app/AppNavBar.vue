<script setup lang="ts">
const props = defineProps<{
  title: string
  imageUrl: string
  itemsStart?: NavItem[]
  itemsEnd?: NavItem[]
  userAvatarUrl?: string
  userEmail?: string
  userDisplayName?: string
  search?: string
  searchOpen?: boolean
}>()

const emit = defineEmits<{
  signout: []
  'update:search': [value: string]
  'update:searchOpen': [open: boolean]
}>()

const search = useVModel(props, 'search', emit, { passive: true })
const searchOpen = useVModel(props, 'searchOpen', emit, { passive: true })
</script>

<template>
  <header
    class="
      flex items-center justify-start
      w-full h-16 pl-5 pr-9 space-x-8
      text-white
    ">

    <!-- Title and logo -->
    <div class="flex items-center space-x-4">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        alt="Logo"
        class="w-8 h-8 rounded mr-1"
      />

      <h1 class="text-sm font-medium font-mono lowercase mr-8">
        {{ title }}
      </h1>
    </div>

    <!-- Items - Start -->
    <nav class="flex items-center grow-1">
      <AppNavBarItem
        v-for="item in itemsStart"
        :key="item.label"
        :to="item.to"
        :label="item.label"
      />
    </nav>

    <!-- Search -->
    <AppNavBarSearch
      v-model="search"
      v-model:open="searchOpen"
      class="shrink-1"
    />

    <!-- Items - End -->
    <nav class="flex items-center justify-end">
      <AppNavBarItem
        v-for="item in itemsEnd"
        :key="item.label"
        :to="item.to"
        :label="item.label"
      />
    </nav>

    <!-- User -->
    <AppNavBarUser
      :avatarUrl="userAvatarUrl"
      :email="userEmail"
      :displayName="userDisplayName"
      @signout="() => emit('signout')"
    />
  </header>
</template>
