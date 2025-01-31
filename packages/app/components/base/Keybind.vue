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
      h-6 whitespace-nowrap text-subtle
    ">

    <!-- Key icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="size-4"
    />

    <!-- Key label -->
    <span
      v-if="label"
      class="text-xs"
      v-text="label"
    />
  </div>
</template>
