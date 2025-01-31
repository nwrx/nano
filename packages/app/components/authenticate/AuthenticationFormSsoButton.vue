<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<{ type: 'github' | 'google' | 'linkedin' | 'microsoft' } & BaseButtonProps>()
const emit = defineEmits<{ click: [] }>()

const icon = computed(() => {
  if (props.type === 'github') return 'i-logos:github-icon'
  if (props.type === 'google') return 'i-logos:google-icon'
  if (props.type === 'linkedin') return 'i-logos:linkedin-icon'
  if (props.type === 'microsoft') return 'i-logos:microsoft-icon'
  return ''
})

const label = computed(() => {
  if (props.type === 'github') return 'Sign in with GitHub'
  if (props.type === 'google') return 'Sign in with Google'
  if (props.type === 'linkedin') return 'Sign in with LinkedIn'
  if (props.type === 'microsoft') return 'Sign in with Microsoft'
  return ''
})
</script>

<template>
  <BaseButton
    v-bind="props"
    :label="label"
    eager
    class="
      flex items-center justify-center w-full
      px-4 py-2 rounded
      transition-all duration-100
      text-white
      opacity-60
      hover:opacity-100
      bg-primary-900
      hover:bg-primary-800/50
      ring-1
      ring-primary-900
      ring-opacity-50
      hover:ring-opacity-100
    "
    @click="() => emit('click')">

    <!-- Icon -->
    <BaseIcon
      :icon="icon"
      class="mr-2"
    />

    <!-- Label -->
    <span
      class="text-sm"
      v-text="label"
    />
  </BaseButton>
</template>
