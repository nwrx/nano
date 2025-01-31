<script setup lang="ts">
defineProps<{
  name: string
  isLinked: boolean
  defaultValue: string
}>()
</script>

<template>
  <div class="truncate px-sm py-xs">

    <!-- Name -->
    <span
      class="text-sm"
      v-text="name"
    />

    <!-- Default -->
    <span
      v-if="!isLinked"
      class="text-subtle text-xs"
      v-text="defaultValue"
    />
  </div>
</template>
