<script setup lang="ts">
defineProps<{
  label: string
  icon?: string
}>()
</script>

<template>
  <!-- A box that represents a keybind -->
  <div
    class="
      inline-flex items-center space-x-1 px-1 rounded
      h-6 whitespace-nowrap
    ">

    <!-- Key icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="opacity-60 w-4 h-4"
    />

    <!-- Key label -->
    <span
      v-if="label"
      class="opacity-60 text-xs"
      v-text="label"
    />
  </div>
</template>
