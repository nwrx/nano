<script setup lang="ts">
defineProps<{ label?: string }>()
</script>

<template>
  <div class="truncate px-sm py-xs">
    <span class="text-sm" v-text="label" />
  </div>
</template>
