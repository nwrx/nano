<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  text: string
  label: string
  to: RouteLocationRaw
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center text-sm">

    <!-- Text -->
    <p class="text-subtle">
      {{ text }}
    </p>

    <!-- Link -->
    <Hyperlink :to="to" class="text-sm">
      {{ label }}
    </Hyperlink>
  </div>
</template>
