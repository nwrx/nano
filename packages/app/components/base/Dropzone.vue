<script setup lang="ts">
import { vMarkdown } from '@unshared/vue/vMarkdown'
defineProps<{
  text: string
  vertical?: boolean
  isOver?: boolean
}>()
</script>

<template>
  <div
    :class="{
      'z-10 op-100': isOver,
      'z-00 op-0': !isOver,
      'flex-col space-y-lg': vertical,
      'flex-row space-x-lg': !vertical,
    }"
    class="
      absolute -top-md -left-md w-[calc(100%+2rem)] h-[calc(100%+0rem)]
      flex items-center justify-center rd p-md
      border-2 border-dashed border-app transition
      pointer-events-none
      bg-primary-500/5 backdrop-blur-xl
    ">
    <BaseIcon
      icon="i-carbon:cloud-upload"
      class="text-prominent"
      :class="vertical ? 'size-12' : 'size-8'"
    />
    <p
      :key="text"
      v-markdown="text"
      class="text-app text-2xl"
    />
  </div>
</template>
