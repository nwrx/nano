<script setup lang="ts">
defineProps<{
  title?: string
  text?: string
}>()
</script>

<template>
  <div class="pb-4 px-4">
    <h1
      v-if="title"
      class="text-2xl font-medium outline-none bg-transparent w-full"
      v-text="title"
    />
    <textarea
      v-if="text"
      class="text-sm outline-none bg-transparent w-full resize-none opacity-70"
      v-text="text"
    />
  </div>
</template>
