<script setup lang="ts">
import { BaseIcon } from '@unshared/vue/BaseIcon'

withDefaults(
  defineProps<{
    zoom?: number
    name?: string
    color?: string
    position?: { x: number; y: number }
  }>(),
  {
    zoom: 1,
    name: 'NAME_MISSING',
    color: 'red',
    position: () => ({ x: 0, y: 0 }),
  },
)
</script>

<template>
  <div
    class="relative flex"
    :style="{
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      pointerEvents: 'none',
      transition: 'transform 0.1s ease',
      zIndex: 9999,
    }">

    <!-- Pointer -->
    <BaseIcon
      icon="i-carbon:cursor-2"
      :style="{
        color,
        fontSize: `${1.5 / zoom}rem`,
      }"
    />

    <!-- Name -->
    <span
      class="font-black whitespace-nowrap text-white"
      :style="{
        backgroundColor: color,
        fontSize: `${0.75 / zoom}rem`,
        borderRadius: `${0.375 / zoom}rem`,
        paddingLeft: `${0.5 / zoom}rem`,
        paddingRight: `${0.5 / zoom}rem`,
        paddingTop: `${0.15 / zoom}rem`,
        paddingBottom: `${0.15 / zoom}rem`,
        marginTop: `${1 / zoom}rem`,
        marginLeft: `${0 / zoom}rem`,
      }"
      v-text="name"
    />
  </div>
</template>
