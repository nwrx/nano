<script setup lang="ts">
import type { NavItem } from '~/utils/types'
defineProps<{ collapsed?: boolean } & NavItem>()
</script>

<template>
  <div>
    <h2
      class="
        text-base ml-4
        font-bold transition-opacity duration-300
      "
      :class="{
        'opacity-0': collapsed,
        'opacity-50': !collapsed,
      }"
      v-text="label"
    />

    <ul class="w-full mt-4 space-y-1">
      <AppNavDrawerItem
        v-for="(item, index) in items"
        :key="index"
        :to="item.to"
        :icon="item.icon"
        :label="item.label"
        :collapsed="collapsed"
      />
    </ul>
  </div>
</template>
