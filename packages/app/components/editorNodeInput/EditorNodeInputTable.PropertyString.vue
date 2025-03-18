<script setup lang="ts">
const value = defineModel()
</script>

<template>
  <input
    v-model="value"
    :class="{ 'text-editor-node italic': !value }"
    class="cursor-text w-0 grow w-full h-full outline-none bg-transparent text-sm px-sm">
</template>
