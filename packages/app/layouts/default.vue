<script setup lang="ts">
import type { NavItem } from '~/utils/types'

const NAV_ITEMS = computed<NavItem[]>(() => [
  { to: '/', text: 'Home' },
  { to: '/about', text: 'About' },
  { to: '/contact', text: 'Contact' },
])
</script>

<template>
  <div class="flex">

    <!-- Nav Drawer -->
    <AppNavDrawer
      class="w-64 h-screen bg-white shadow"
      :items="NAV_ITEMS"
    />

    <!-- Main Content -->
    <main class="flex-1">
      <NuxtPage />
    </main>
  </div>
</template>
