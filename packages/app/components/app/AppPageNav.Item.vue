<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  icon?: string
  label?: string
  to?: RouteLocationRaw
}>()
</script>

<template>
  <BaseButton
    eager
    :to="to"
    :label="label"
    class-active="
      bg-primary-200/20
      font-medium
    "
    class="
      flex items-center gap-2 px-3 py-2 rounded
      opacity-80 hover:opacity-100
      hover:bg-primary-200/10
    ">

    <!-- Icon -->
    <BaseIcon v-if="icon" :icon="icon" />

    <!-- Label -->
    <span>{{ label }}</span>

  </BaseButton>
</template>
