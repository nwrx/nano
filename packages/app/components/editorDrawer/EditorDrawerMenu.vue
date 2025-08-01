<script setup lang="ts">
import type { Editor } from '@nwrx/nano-api'

const props = defineProps<{
  group?: Editor.ComponentGroup
  components?: Editor.ComponentObject[]
}>()

const title = computed(() => {
  if (!props.group) return ''
  if (props.group.title) return localize(props.group.title)
  return props.group.name
})
</script>

<template>
  <div class="w-full p-md">

    <!-- Title -->
    <div class="text-xs font-medium text-subtle uppercase">
      {{ title }}
    </div>

    <!-- Components -->
    <div class="flex flex-col space-y-1 mt-4">
      <EditorDrawerItem
        v-for="component in components"
        ref="containerRef"
        :key="component.name"
        :component="component"
      />
    </div>
  </div>
</template>
