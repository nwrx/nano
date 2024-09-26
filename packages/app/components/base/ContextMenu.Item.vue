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
      w-full p-2 space-x-3 rounded

      text-black/60
      hover:text-black/100

      bg-transparent
      hover:bg-primary-100/30
    ">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="w-4 h-4"
    />

    <!-- Label -->
    <span class="text-sm text-left truncate grow">
      {{ label }}
    </span>

    <!-- Keybind -->
    <Keybind
      v-if="keybind"
      :label="keybind"
      class="border border-black/10 rounded ml-auto"
    />
  </BaseButton>
</template>
