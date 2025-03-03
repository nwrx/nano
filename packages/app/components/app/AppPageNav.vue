<script setup lang="ts">
defineProps<{ groups?: NavItem[] }>()
</script>

<template>
  <div class="flex flex-col w-full h-full max-w-80 gap-sm p-lg border-r border-app">
    <slot />
  </div>
</template>
