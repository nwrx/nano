<script setup lang="ts">
import { BaseIcon } from '@unshared/vue/BaseIcon'
import { vMarkdown } from '~/utils/vMarkdown'

defineProps<{
  icon?: string
  label?: string
  description?: string
  isSelected?: boolean
}>()
</script>

<template>
  <div
    class="
      flex items-center space-x-sm p-sm rd
      hover:bg-emphasized
      ring ring-transparent
      hover:ring-editor-active
      cursor-pointer
    ">

    <!-- Icon -->
    <div v-if="icon" class="size-4 mt-xs self-start">
      <BaseIcon class="size-4" :icon="icon" load />
    </div>

    <!-- Name -->
    <div class="grow">
      <p v-markdown="label" class="text-sm break-all line-clamp-1" />
      <p v-markdown="description" class="text-xs text-subtle break-all line-clamp-2" />
    </div>

    <!-- Checkmark -->
    <BaseIcon
      v-if="isSelected"
      icon="i-carbon:checkmark"
      class="size-4 shrink-0"
    />
  </div>
</template>
