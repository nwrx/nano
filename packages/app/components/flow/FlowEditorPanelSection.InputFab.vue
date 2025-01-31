<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<{
  inlineLeft?: boolean
  inlineRight?: boolean
  icon?: string
} & BaseButtonProps>()
</script>

<template>
  <BaseButton
    v-bind="props"
    :class="{
      'rounded-l-none': inlineRight,
      'rounded-r-none': inlineLeft,
    }"
    class="
      w-full h-8
      text-xs
      outline-none px-2 py-1 rounded
      bg-primary-100

      text-black/70
      hover:text-black/80
      focus:text-black/90

      placeholder-black/20
      hover:placeholder-black/40
      focus:placeholder-black/0

      border-px
      border-primary-100
      hover:border-primary-200
      focus:border-primary-200

      bg-opacity-20
      hover:bg-opacity-60
      focus:bg-opacity-50
      hover:focus:bg-opacity-60

      transition-all duration-100
    ">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="w-4 h-4"
    />
  </BaseButton>
</template>
