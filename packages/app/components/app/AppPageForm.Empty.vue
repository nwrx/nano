<script setup lang="ts">
import { BaseIcon } from '@unshared/vue/BaseIcon'

defineProps<{
  title?: string
  text?: string
  icon?: string
}>()
</script>

<template>
  <div class="text-center p-lg text-subtle">

    <!-- Icon -->
    <div class="mb-md">
      <BaseIcon
        :icon="icon ?? 'i-carbon:warning-alt'"
        class="size-12 mx-auto opacity-50"
      />
    </div>

    <!-- Title -->
    <p class="text-lg font-medium mb-sm">
      <slot name="title">
        {{ title }}
      </slot>
    </p>

    <!-- Text -->
    <p class="text-sm max-w-sm mx-auto">
      <slot>
        {{ text }}
      </slot>
    </p>
  </div>
</template>
