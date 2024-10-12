<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

defineProps<{
  title: string
  text: string
  icon?: string
} & BaseButtonProps>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="flex items-center space-x-md border-t first:border-t-0 p-md">

    <!-- Description -->
    <div class="grow">
      <h3 class="text-base font-medium">
        <slot name="title">{{ title }}</slot>
      </h3>
      <p class="text-sm text-subtle">
        <slot name="text">{{ text }}</slot>
      </p>
    </div>

    <!-- CTA -->
    <Button
      :label="label"
      :icon-append="icon"
      class="shrink-0"
      @click="() => emit('click')"
    />
  </div>
</template>
