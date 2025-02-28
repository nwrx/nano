<script setup lang="ts">
import type { EditorParticipantJSON } from '@nwrx/nano-api'

const props = defineProps<{
  editor: Editor
  peer: EditorParticipantJSON
}>()

const worldPosition = computed(() => props.editor.view.worldToView(props.peer.position))
</script>

<template>
  <div
    class="relative flex"
    :style="{
      position: 'absolute',
      left: `${worldPosition.x}px`,
      top: `${worldPosition.y}px`,
      pointerEvents: 'none',
      transition: 'transform 0.1s ease',
      zIndex: 9999,
    }">

    <!-- Pointer -->
    <BaseIcon
      icon="i-carbon:cursor-2"
      :style="{
        color: peer.color,
        fontSize: `${1.5 / (editor.view.zoom ?? 1)}rem`,
      }"
    />

    <!-- Name -->
    <span
      class="font-black whitespace-nowrap text-white"
      :style="{
        backgroundColor: props.peer.color,
        fontSize: `${0.75 / (props.editor.view.zoom ?? 1)}rem`,
        borderRadius: `${0.375 / (props.editor.view.zoom ?? 1)}rem`,
        paddingLeft: `${0.5 / (props.editor.view.zoom ?? 1)}rem`,
        paddingRight: `${0.5 / (props.editor.view.zoom ?? 1)}rem`,
        paddingTop: `${0.15 / (props.editor.view.zoom ?? 1)}rem`,
        paddingBottom: `${0.15 / (props.editor.view.zoom ?? 1)}rem`,
        marginTop: `${1 / (props.editor.view.zoom ?? 1)}rem`,
        marginLeft: `${0 / (props.editor.view.zoom ?? 1)}rem`,
      }"
      v-text="peer.name"
    />
  </div>
</template>
