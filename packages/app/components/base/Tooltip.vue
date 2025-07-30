<script setup lang="ts">
import { vMarkdown } from '~/utils/vMarkdown'

const props = defineProps<{
  title?: string
  text?: string
  position?: 'bottom' | 'left' | 'right' | 'top'
  disabled?: boolean
  persistent?: boolean
}>()

const isVisible = defineModel({ default: false })
const classes = computed(() => {
  const { position = 'bottom' } = props
  return {
    'left-0': position === 'left',
    'right-0': position === 'right',
    'bottom-full left-0': position === 'top',
    'top-full left-0': position === 'bottom',
  }
})
</script>

<template>
  <div
    class="relative"
    @mouseenter="() => isVisible = true"
    @mouseleave="() => isVisible = false"
    @click="() => isVisible = false">

    <!-- Content -->
    <slot />

    <!-- Tooltip -->
    <div
      v-if="(isVisible || persistent) && !disabled"
      class="absolute min-w-md pt-md"
      :class="classes">

      <!-- Title -->
      <div class="b b-app rd backdrop-blur-lg">
        <h3 v-if="title" class="text-base font-semibold p-md b-b b-app bg-subtle/60">
          {{ title }}
        </h3>

        <!-- Text -->
        <p
          v-if="text"
          v-markdown="text"
          class="text-base font-normal p-md bg-app/60 "
        />
      </div>
    </div>
  </div>
</template>
