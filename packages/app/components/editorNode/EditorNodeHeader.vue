<script setup lang="ts">
import type { Editor } from '@nwrx/nano-api'
import EditorTooltip from '~/components/editor/EditorTooltip.vue'
import EditorNodeTooltip from '~/components/editorNode/EditorNodeTooltip.vue'
import IconDynamic from '~/components/icon/IconDynamic.vue'

const props = defineProps<{
  node?: Editor.NodeObject
  component?: Editor.ComponentObject
}>()

const isGrabbing = ref(false)
const title = computed(() => {
  if (props.component) {
    return props.component.title
      ? localize(props.component.title)
      : props.component.name
  }
  else if (props.node) {
    return props.node.name || props.node.id
  }
  return 'NO_NAME'
})
</script>

<template>
  <div
    class="flex justify-start items-center h-8 pr-sm rd-t"
    @mousedown="() => isGrabbing = true"
    @mouseup="() => isGrabbing = false">

    <!-- Tooltip -->
    <EditorTooltip class="h-8 flex items-center justify-center space-x-sm px-sm">
      <!--
        <div v-if="component.icon" class="size-8 flex items-center justify-center">
        <BaseIcon :icon="node.component.icon" class="size-5 text-white rd" load />
        </div>
      -->

      <IconDynamic
        :name="component?.icon"
        fallback="i-carbon:box"
        class="size-5"
        load
      />

      <!-- Title -->
      <p class="font-medium text-white">
        {{ title }}
      </p>

      <!-- Tooltip content -->
      <template #tooltip>
        <EditorNodeTooltip
          :node="node"
          :component="component"
        />
      </template>
    </EditorTooltip>
  </div>
</template>
