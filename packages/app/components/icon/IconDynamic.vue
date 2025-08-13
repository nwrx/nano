<!-- eslint-disable unicorn/explicit-length-check -->
<script setup lang="ts">
import type { MaybeLiteral } from '@unshared/types'
import { BaseIcon } from '@unshared/vue/BaseIcon'

const props = defineProps<{
  name?: string
  color?: MaybeLiteral<'monochrome'>
  size?: number
  width?: number
  height?: number
  load?: boolean
  fallback?: string
}>()

// --- Api URL from runtime config.
const apiUrl = useRuntimeConfig().public.apiUrl

// --- Adapt the color based on the dark mode.
const localSettings = useLocalSettings()
const color = computed(() => {
  const isDark = localSettings.value.themeColor === 'dark'
  if (props.color === 'monochrome') return isDark ? 'white' : 'black'
  return props.color
})

// --- Computed icon URL based on name and color.
const iconUrl = computed(() => {
  if (!apiUrl) return
  if (!props.name) return
  const url = new URL(`/icons/${props.name}`, apiUrl)
  if (color.value) url.searchParams.set('color', color.value)
  if (props.size) url.searchParams.set('size', props.size.toString())
  if (props.width) url.searchParams.set('width', props.width.toString())
  if (props.height) url.searchParams.set('height', props.height.toString())
  return url.href
})
</script>

<template>
  <BaseIcon
    v-if="iconUrl ?? fallback"
    :icon="iconUrl ?? fallback"
    :alt="name ?? fallback"
    :load="load"
  />
</template>
