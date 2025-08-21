<script setup lang="ts">
import { BaseIcon } from '@unshared/vue/BaseIcon'
import { vMarkdown } from '@unshared/vue/vMarkdown'

defineProps<{
  text?: string
  icon?: string
  classHint?: string
}>()
</script>

<template>
  <div class="hint w-full flex space-x-md p-md rd">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="size-4 shrink-0 mt-xs"
    />

    <!-- Text -->
    <slot>
      <p v-markdown="text" class="text-sm" />
    </slot>
  </div>
</template>
