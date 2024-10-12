<script setup lang="ts">
defineProps<{ name: string; value: string }>()
</script>

<template>
  <div>
    <p class="text-xs text-subtle">{{ name }}</p>
    <p class="text-sm text-app">{{ value }}</p>
  </div>
</template>
