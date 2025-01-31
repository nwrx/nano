<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  label?: string
  to?: RouteLocationRaw
}>()
</script>

<template>
  <BaseButton
    eager
    :to="to"
    :label="label"
    class="flex items-center text-layout-subtle hover:text-layout transition">

    <!-- Label -->
    <span class="px-md text-sm">{{ label }}</span>

  </BaseButton>
</template>
