<script setup lang="ts" generic="T, U extends ToggleType">
import type { BaseInputToggleProps, ToggleType } from '@unshared/vue'

const props = defineProps<{
  label: string
} & BaseInputToggleProps<T, U>>()
</script>

<template>
  <BaseInputToggle>

    <!-- Switch (like iOS switch) -->
    <div class="flex items-center justify-center w-12 h-6 rounded-full bg-primary-300">

      <!-- Dot -->
      <div
        class="w-6 h-6 rounded-full bg-white shadow-md"
        :class="{
          'translate-x-6': props.modelValue,
          'translate-x-0': !props.modelValue,
        }"
      />

    </div>
  </BaseInputToggle>
</template>
