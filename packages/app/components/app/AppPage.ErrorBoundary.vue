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
      absolute top-0 left-0 w-full h-full space-y-4
      flex flex-col items-center justify-center
      bg-opacity-90 text-white
      bg-banknote-primary-800/60
      border border-primary-800/60
      dark
  ">

    <!-- Status Code -->
    <!--
      <p
      class="text-8rem text-primary-900 font-medium font-mono"
      v-text="statusCode ? `Error ${statusCode}` : '404'"
      />
    -->

    <!-- Error Message -->
    <p class="text-center text-xl font-mono bg-primary-900 p-4 rounded-lg border border-primary-800/60">
      {{ message }}
    </p>

    <!-- Clear Error Button -->
    <Button
      link
      label="Clear Error"
      @click="() => emit('clearError')"
    />

    <!-- Stack Trace -->
    <!--
      <pre
      v-if="stack"
      class="p-4 text-xs bg-primary-900/80 rounded-lg border border-primary-800/60 mt-"
      v-text="stack"
      />
    -->
  </div>
</template>

<style>
.stack.internal {
  opacity: 0.5;
}
</style>
