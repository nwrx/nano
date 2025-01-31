<script setup lang="ts">
import type { NavItem } from '~/utils/types'

defineProps<{
  items?: NavItem[]
  collapsed?: boolean
}>()
</script>

<template>
  <nav
    class="w-full children:transition-all children:duration-300"
    :class="{
      'space-y-0': collapsed,
      'space-y-12': !collapsed,
    }">

    <!-- Nav items -->
    <template v-for="(item, index) in items" :key="index">
      <AppNavDrawerGroup
        v-if="item.items"
        :items="item.items"
        :label="item.label"
        :collapsed="collapsed"
      />

      <AppNavDrawerItem
        v-else-if="item.to"
        :to="item.to"
        :icon="item.icon"
        :label="item.label"
        :collapsed="collapsed"
      />
    </template>
  </nav>
</template>
