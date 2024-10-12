<script setup lang="ts">
defineProps<{
  stack?: string
  message?: string
  statusCode?: number
}>()

const emit = defineEmits<{
  clearError: []
}>()
</script>

<template>
  <div
    class="
      absolute top-0 left-0 w-full h-full space-y-base
      flex flex-col items-center justify-center
      bg-banknote-layout-foreground
      border border-layout
  ">

    <!-- Status Code -->
    <p
      class="text-8xl text-layout font-light font-mono"
      v-text="statusCode"
    />

    <!-- Error Message -->
    <p class="text-center text-xl font-mono bg-layout p-sm rounded border border-layout">
      {{ message }}
    </p>

    <!-- Clear Error Button -->
    <Button
      link
      label="Go Back"
      icon-append="i-carbon:arrow-right"
      icon-expand
      @click="() => emit('clearError')"
    />
  </div>
</template>

<style>
.stack.internal {
  opacity: 0.5;
}
</style>
