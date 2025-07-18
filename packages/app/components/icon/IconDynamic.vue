<!-- eslint-disable unicorn/explicit-length-check -->
<script setup lang="ts">
import { BaseIcon } from '@unshared/vue/BaseIcon'

const props = defineProps<{
  name?: string
  color?: string
  size?: number
  width?: number
  height?: number
  load?: boolean
}>()

// --- Api URL from runtime config.
const apiUrl = useRuntimeConfig().public.apiUrl

// --- Computed icon URL based on name and color.
const iconUrl = computed(() => {
  if (!apiUrl) return
  if (!props.name) return
  const url = new URL(`/api/icons/${props.name}`, apiUrl)
  if (props.color) url.searchParams.set('color', props.color)
  if (props.size) url.searchParams.set('size', props.size.toString())
  if (props.width) url.searchParams.set('width', props.width.toString())
  if (props.height) url.searchParams.set('height', props.height.toString())
  return url.href
})
</script>

<template>
  <BaseIcon
    v-if="iconUrl"
    :icon="iconUrl"
    :alt="name"
    :load="load"
  />
</template>
