<script setup lang="ts">
import type { RegistryCategoryObject } from '@nwrx/nano-api'

defineProps<{
  editor: Editor
  categories: RegistryCategoryObject[]
}>()
</script>

<template>
  <div
    id="editor"
    :ref="editor.view.setViewContainer"
    tabindex="0"
    disabled
    :style="editor.view.viewContainerStyle"
    class="w-full h-full bg-editor select-none relative overflow-hidden z-0 select-none transform-gpu"
    @mousemove="(event) => editor.view.onScreenMouseMove(event)"
    @mouseup="(event) => editor.view.onScreenMouseUp(event)"
    @keydown="(event) => editor.view.onScreenKeyDown(event)"
    @keyup="(event) => editor.view.onScreenKeyUp(event)">

    <!-- Selector box -->
    <EditorSelection :editor />

    <!-- View -->
    <div
      :ref="editor.view.setView"
      :style="editor.view.viewStyle"
      @dragover.prevent
      @dragenter.prevent
      @contextmenu.prevent
      @drop="(event) => editor.view.onScreenDrop(event)"
      @wheel="(event) => editor.view.onScreenWheel(event)"
      @mousedown="(event) => editor.view.onScreenMouseDown(event)">
      <EditorBackground />
      <EditorLinks :editor />
      <EditorPeer v-for="peer in editor.view.peers" :key="peer.id" :peer :editor />
      <EditorNode v-for="node in editor.view.nodes" :key="node.id" :node :editor />
    </div>

    <!-- Overlay -->
    <div class="absolute top-0 left-0 h-full w-full z-10 pointer-events-none p-md">
      <div class="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-md w-full h-full">
        <EditorToolbar :editor class="pointer-events-auto justify-self-start" />
        <EditorPanel :editor class="pointer-events-auto row-span-2 justify-self-end h-full" />
        <EditorDrawer :editor :categories class="pointer-events-auto self-start justify-self-start" />
        <!-- <EditorConsole :editor class="pointer-events-auto self-start justify-self-start" /> -->
      </div>
    </div>
  </div>
</template>
