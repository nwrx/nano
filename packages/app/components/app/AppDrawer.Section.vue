<script setup lang="ts">
import type { NavItem } from '~/utils/types'

defineProps<{
  items?: NavItem[]
  isOpen?: boolean
}>()
</script>

<template>
  <nav
    class="w-full children:transition-all children:duration-300"
    :class="{
      'space-y-0': !isOpen,
      'space-y-12': isOpen,
    }">

    <!-- Nav items -->
    <template v-for="(item, index) in items" :key="index">
      <AppDrawerGroup
        v-if="item.items"
        :items="item.items"
        :label="item.label"
        :is-open="isOpen"
      />

      <AppDrawerItem
        v-else-if="item.to"
        :to="item.to"
        :icon="item.icon"
        :label="item.label"
        :is-open="isOpen"
      />
    </template>
  </nav>
</template>
