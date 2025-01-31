<script setup lang="ts">
defineProps<{ label?: string }>()
</script>

<template>
  <p class="whitespace-nowrap truncate pl-sm text-subtle shrink-0 mr-sm">
    {{ label }}:
  </p>
</template>
