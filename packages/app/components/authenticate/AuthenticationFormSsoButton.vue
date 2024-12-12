<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<BaseButtonProps & { type: 'github' | 'google' | 'linkedin' | 'microsoft' }>()
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
      px-4 py-2 rd transition
      opacity-80 hover:opacity-100
      bg-emphasized hover:bg-prominent
      b b-app
    "
    @click="() => emit('click')">

    <!-- Icon -->
    <BaseIcon
      :icon="icon"
      class="mr-2"
    />

    <!-- Label -->
    <span
      class="text-sm font-medium"
      v-text="label"
    />
  </BaseButton>
</template>
