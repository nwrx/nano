<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<{
  label: string
  icon?: string
  keybind?: string
} & BaseButtonProps>()
</script>

<template>
  <BaseButton
    v-bind="props"
    eager
    class="
      flex items-center justify-start
      w-full p-sm space-x-md rounded
      text-subtle hover:text-app-emphasis
      hover:bg-prominent
      transition
    ">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="size-4"
    />

    <!-- Label -->
    <span class="text-sm text-left truncate grow">
      {{ label }}
    </span>

    <!-- Keybind -->
    <Keybind
      v-if="keybind"
      :label="keybind"
      class="border border-app rounded ml-auto"
    />
  </BaseButton>
</template>
