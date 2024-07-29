<script setup lang="ts">
import { NuxtLink } from '#components'
import type { BaseButtonProps } from 'unshared'

const props = defineProps<{
  icon?: string
  iconAppend?: string
  iconPrepend?: string
} & BaseButtonProps>()

const slots = defineSlots<{
  default: () => VNode
}>()

const classes = computed(() => ({
  'px-3 py-3': !props.label && !slots.default,
  'px-4 py-2 ': props.label ?? slots.default,
}))
</script>

<template>
  <BaseButton
    class="
      flex items-center justify-center
      text-sm font-medium text-white
      bg-primary-600 bg-opacity-90 hover:bg-opacity-100
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    "
    :class="classes"
    v-bind="props"
    v-slot="slotProps"
    :as="to ? NuxtLink : undefined">

    <!-- Icon -->
    <BaseIcon
      as="i"
      v-if="iconPrepend || icon"
      :icon="iconPrepend || icon"
      :class="{ 'mr-2': label }"
      class="w-4 h-4"
      load
    />

    <!-- Content -->
    <slot v-bind="slotProps">
      <span v-if="label" v-text="label" />
    </slot>

    <!-- Icon -->
    <BaseIcon
      as="i"
      v-if="iconAppend || slotProps.isLoading"
      :icon="slotProps.isLoading ? 'i-line-md:loading-loop' : iconAppend"
      :class="{ 'ml-2': label }"
      class="w-4 h-4"
      load
    />
  </BaseButton>
</template>
