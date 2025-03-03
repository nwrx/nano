<script setup lang="ts">
defineProps<{
  contained?: boolean
}>()
</script>

<template>
  <div
    class="sm:p-2xl p-lg items-center w-full"
    :class="{ 'max-w-page mx-auto': contained }">
    <slot />
  </div>
</template>
