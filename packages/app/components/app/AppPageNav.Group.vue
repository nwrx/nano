<script setup lang="ts">
defineProps<{
  label?: string
  items?: NavItem[]
}>()
</script>

<template>
  <div class="flex flex-col gap-2 not-last:border-b border-white/20 py-2 first:pt-0 last:pb-0">

    <!-- Label -->
    <div v-if="label" class="text-sm font-medium opacity-80">
      {{ label }}
    </div>

    <!-- Items -->
    <div class="flex flex-col">
      <slot>
        <AppPageNavItem
          v-for="item in items"
          :key="item.label"
          :icon="item.icon"
          :label="item.label"
          :to="item.to"
        />
      </slot>
    </div>
  </div>
</template>
