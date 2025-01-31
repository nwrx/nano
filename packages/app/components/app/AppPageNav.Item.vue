<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

defineProps<{
  icon?: string
  label?: string
  compact?: boolean
} & BaseButtonProps>()
</script>

<template>
  <BaseButton
    eager
    :to="to"
    :label="label"
    :class="{
      'h-8 text-sm': compact,
      'h-10 text-base': !compact,
    }"
    class-active="
      font-medium !bg-prominent !text-prominent
    "
    class="
      flex items-center gap-sm px-md rd
      bg-transparent hover:bg-emphasized
      text-app hover:text-app
    ">

    <!-- Icon -->
    <BaseIcon v-if="icon" :icon="icon" />

    <!-- Label -->
    <span>{{ label }}</span>

  </BaseButton>
</template>
