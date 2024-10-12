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
    class="flex items-center text-subtle hover:text-app transition">

    <!-- Label -->
    <span>{{ label }}</span>

  </BaseButton>
</template>
