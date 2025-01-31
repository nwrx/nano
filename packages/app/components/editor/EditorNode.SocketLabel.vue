<script setup lang="ts">
defineProps<{ label?: string }>()
</script>

<template>
  <p class="text-sm truncate text-subtle shrink-0 mr-sm">
    {{ label }}:
  </p>
</template>
