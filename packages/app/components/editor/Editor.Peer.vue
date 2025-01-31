<script setup lang="ts">
import type { CSSProperties } from 'vue'

const props = defineProps<{
  name: string
  color: string
  zoom?: number
}>()

const styleIcon = computed<CSSProperties>(() => ({
  color: props.color,
  fontSize: `${1.5 / (props.zoom ?? 1)}rem`,
}))

const styleName = computed<CSSProperties>(() => ({
  backgroundColor: props.color,
  fontSize: `${0.75 / (props.zoom ?? 1)}rem`,
  borderRadius: `${0.375 / (props.zoom ?? 1)}rem`,
  paddingLeft: `${0.5 / (props.zoom ?? 1)}rem`,
  paddingRight: `${0.5 / (props.zoom ?? 1)}rem`,
  paddingTop: `${0.15 / (props.zoom ?? 1)}rem`,
  paddingBottom: `${0.15 / (props.zoom ?? 1)}rem`,
  marginTop: `${1 / (props.zoom ?? 1)}rem`,
  marginLeft: `${0 / (props.zoom ?? 1)}rem`,
}))
</script>

<template>
  <div class="relative flex">

    <!-- Pointer -->
    <BaseIcon
      icon="i-carbon:cursor-2"
      :style="styleIcon"
    />

    <!-- Name -->
    <span
      :style="styleName"
      class="font-black whitespace-nowrap text-white"
      v-text="name"
    />
  </div>
</template>
