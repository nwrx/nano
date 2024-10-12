<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<{
  icon?: string
  label?: string
  isActive?: boolean
} & BaseButtonProps>()
</script>

<template>
  <BaseButton
    v-bind="props"
    eager
    :class="{
      'text-app !bg-prominent': isActive,
    }"
    class="
      flex items-center justify-center size-10 rounded
      hover:bg-prominent transition
    ">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="size-6 shrink-0"
    />
  </BaseButton>
</template>
