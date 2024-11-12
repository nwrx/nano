<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="w-full h-full flex items-center justify-center p-lg bg-app">
    <div class="absolute inset-0 bg-diagonallines-primary-500/20" />
    <div class="relative z-10 bg-app p-md rounded b b-primary-500/20">
      <slot>{{ text }}</slot>
    </div>
  </div>
</template>
