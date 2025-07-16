<script setup lang="ts">
import type { FlowNodeObject } from '@nwrx/nano-api'
import type { ThreadServerMessage } from '@nwrx/nano-runner'
import Collapse from '~/components/base/Collapse.vue'
import DataSheet from '~/components/base/DataSheet.vue'
import ThreadMessagesMessageHeader from './ThreadMessages.MessageHeader.vue'

defineProps<{
  maxConcurrency?: number
  message: ThreadServerMessage
  node?: FlowNodeObject
}>()

const showBody = ref(false)
</script>

<template>
  <div
    :class="{
      'bg-editor-panel-data ring-editor': showBody,
      'hover:bg-editor-panel-data ring-transparent': !showBody,
    }"
    class="
      flex items-stretch rd relative ring hover:ring-active
    ">

    <!-- Pin -->
    <!--
      <EditorPanelMessagesMessageTree
      :item="item"
      :max-concurrency="maxConcurrency"
      />
    -->

    <!-- Header -->
    <div class="w-full">
      <ThreadMessagesMessageHeader
        class="cursor-pointer select-none"
        :message="message"
        :node="node"
        @mousedown="() => showBody = !showBody"
      />

      <!-- Body -->
      <Collapse v-model="showBody">
        <div class="p-md">
          <DataSheet :model-value="message.data" />
        </div>
      </Collapse>
    </div>
  </div>
</template>
