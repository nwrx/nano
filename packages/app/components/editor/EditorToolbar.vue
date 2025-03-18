<script setup lang="ts">
import type { FlowObject } from '@nwrx/nano-api'
import EditorDownloadDialog from './EditorDownloadDialog.vue'
import EditorFab from './EditorFab.vue'

defineProps<{
  flow?: FlowObject
  getFlowExport?: (format?: 'json' | 'yaml') => Promise<string>
}>()

const showDownloadDialog = ref(false)
</script>

<template>
  <div
    class="
      flex items-center space-x-sm px-sm h-12 rd
      bg-editor-panel b b-editor backdrop-blur-2xl
    ">

    <!-- Name -->
    <h1 class="text-base line-clamp-1 px-sm select-text select-none">
      {{ flow?.title || flow?.name || 'MISSING_FLOW_PROP' }}
    </h1>

    <!-- Favorite -->
    <!--
      <EditorFab
      :icon="isBookmarked ? 'i-carbon:bookmark-add' : 'i-carbon:bookmark'"
      @click="() => emit('bookmark')"
      />
    -->

    <!-- Divider -->
    <div class="h-full b-r b-editor" />

    <!-- Settings -->
    <EditorFab icon="i-carbon:settings" />

    <!-- Export -->
    <EditorFab
      icon="i-carbon:download"
      @click="() => showDownloadDialog = true"
    />

    <!-- Chat -->
    <!--
      <EditorFab
      icon="i-carbon:chat-bot"
      @click="() => router.push(`${route.fullPath}/chat`)"
      />
    -->
    <!-- Show Flow dialog -->
    <EditorDownloadDialog
      v-model:show="showDownloadDialog"
      :flow="flow"
      :get-flow-export="getFlowExport"
    />
  </div>
</template>
