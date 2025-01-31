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
    <p class="text-white/50">
      {{ text }}
    </p>
    <Button :to="to" class="text-sm" link>
      {{ label }}
    </Button>
  </div>
</template>
