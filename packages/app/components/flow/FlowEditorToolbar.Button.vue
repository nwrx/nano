<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<{
  icon?: string
  label?: string
} & BaseButtonProps>()
</script>

<template>
  <BaseButton
    class="
      flex items-center justify-center
      h-10 w-10 rounded
      opacity-80 hover:opacity-100
      hover:bg-primary-200
      transition-all duration-100
    "
    v-bind="props">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="w-6 h-6 shrink-0"
    />
  </BaseButton>
</template>
