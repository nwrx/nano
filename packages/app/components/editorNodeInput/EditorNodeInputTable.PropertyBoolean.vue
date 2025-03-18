<script setup lang="ts">
const value = defineModel()
</script>

<template>
  <div
    class="flex items-center w-full h-full grow cursor-pointer px-sm space-x-sm"
    @mousedown.stop="() => value = !value">

    <!-- iOs like Switch  -->
    <div
      class="flex items-center w-8 h-4 b b-editor rd-full transition"
      :class="{
        'bg-active': value,
        'bg-subtle': !value,
      }">

      <!-- Circle -->
      <div
        class="w-3 h-3 b b-editor rd-full transition"
        :class="{
          'bg-subtle translate-x-4': value,
          'bg-active translate-x-0.5': !value,
        }"
      />
    </div>
  </div>
</template>
