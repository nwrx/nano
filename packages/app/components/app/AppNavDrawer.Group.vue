<script setup lang="ts">
import type { NavItem } from '~/utils/types'
defineProps<{ isOpen?: boolean } & NavItem>()
</script>

<template>
  <div>
    <h2
      class="text-sm ml-2 transition-opacity duration-300"
      :class="isOpen ? 'opacity-50' : 'opacity-0'"
      v-text="label"
    />

    <div class="w-full mt-4 space-y-2">
      <AppNavDrawerItem
        v-for="(item, index) in items"
        :key="index"
        :to="item.to"
        :icon="item.icon"
        :label="item.label"
        :isOpen="isOpen"
      />
    </div>
  </div>
</template>
