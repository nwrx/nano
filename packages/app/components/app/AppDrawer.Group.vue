<script setup lang="ts">
import type { NavItem } from '~/utils/types'
defineProps<{ isOpen?: boolean } & NavItem>()
</script>

<template>
  <div>
    <h2
      class="text-sm ml-md transition text-layout-subtle"
      :class="{ 'opacity-0': !isOpen }"
      v-text="label"
    />

    <div class="w-full mt-md space-y-sm">
      <AppDrawerItem
        v-for="(item, index) in items"
        :key="index"
        :to="item.to"
        :icon="item.icon"
        :label="item.label"
        :is-open="isOpen"
      />
    </div>
  </div>
</template>
