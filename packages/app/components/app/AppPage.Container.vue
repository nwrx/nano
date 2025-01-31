<script setup lang="ts">
defineProps<{
  contained?: boolean
}>()
</script>

<template>
  <div class="flex flex-col mx-auto sm:p-16 p-8 items-center w-full" :class="{ 'max-w-6xl': contained }">
    <slot/>
  </div>
</template>
