<script setup lang="ts">
import { vMarkdown } from '#imports'

defineProps<{
  title?: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="flex items-center justify-between p-4">

    <!-- Title -->
    <h2>
      <slot>
        <span v-markdown="title"/>
      </slot>
    </h2>

    <!-- Close -->
    <Button
      eager
      light
      variant="primary"
      icon="i-carbon:close"
      class="!p-1"
      @click="() => emit('close')"
    />
  </div>
</template>
