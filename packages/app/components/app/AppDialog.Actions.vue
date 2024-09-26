<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<{
  label: string
  variant?: Variant
  hideCancel?: boolean
  manualClose?: boolean
} & BaseButtonProps>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

function onClick() {
  emit('confirm')
  if (!props.manualClose) emit('close')
}
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <Button
      v-if="!hideCancel"
      label="Cancel"
      icon="i-carbon:close"
      size="sm"
      link
      @click="() => emit('close')"
    />
    <Button
      v-bind="props"
      :variant="variant ?? 'success'"
      :label="label"
      icon-append="i-carbon:chevron-right"
      icon-expand
      size="sm"
      filled
      @click="() => onClick()"
    />
  </div>
</template>
