<script setup lang="ts">
defineProps<{
  labelCancel: string
  labelConfirm: string
  variant?: Variant
  disabled?: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <Button
      :label="labelCancel"
      icon="i-carbon:close"
      size="sm"
      class="ml-2"
      link
      @click="() => emit('close')"
    />
    <Button
      light
      outlined
      :variant="variant ?? 'success'"
      :label="labelConfirm"
      icon-append="i-carbon:chevron-right"
      icon-expand
      size="sm"
      :disabled="disabled"
      @click="() => emit('confirm')"
    />
  </div>
</template>
