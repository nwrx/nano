<script setup lang="ts">
import { NuxtLink } from '#components'
import type { BaseButtonProps } from 'unshared'

const props = defineProps<{
  icon?: string
  iconAppend?: string
  iconPrepend?: string
} & BaseButtonProps>()
</script>

<template>
  <BaseButton
    v-bind="props"
    v-slot="slotProps"
    :as="to ? NuxtLink : undefined"
    :to="to"
    :disabled="disabled"
    :label="label"
    class="
      inline-flex items-center justify-start
      text-sm font-medium
      text-primary-600/70
      hover:text-primary-600/100
      transition-colors duration-100
    ">

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
