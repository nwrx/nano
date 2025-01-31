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
    class="
      flex items-center
      text-base
      text-white
      opacity-60
      h-16 px-4
      hover:opacity-100
      transition-opacity duration-200
    ">

    <!-- Label -->
    <span>{{ label }}</span>

  </BaseButton>
</template>
