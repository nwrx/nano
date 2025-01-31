<script setup lang="ts">
defineProps<{
  contained?: boolean
}>()
</script>

<template>
  <div
    class="flex flex-col sm:p-16 p-8 items-center w-full h-full"
    :class="{ 'max-w-container mx-auto': contained }">
    <slot/>
  </div>
</template>
