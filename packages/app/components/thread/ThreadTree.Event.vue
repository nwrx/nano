<script setup lang="ts">
import type { ThreadTree } from '~/composables/useThread'
import Collapse from '~/components/base/Collapse.vue'
import DataSheet from '~/components/base/DataSheet.vue'
import EventHeader from './ThreadTree.EventHeader.vue'
import EventTree from './ThreadTree.EventTree.vue'

defineProps<{
  maxDepth: number
  item: ThreadTree.Item
}>()

const isOpen = ref(false)
</script>

<template>
  <div
    :class="{
      'bg-editor-panel-data ring-editor': isOpen,
      'hover:bg-editor-panel-data ring-transparent': !isOpen,
    }"
    class="
      flex items-stretch rd relative ring hover:ring-active
    ">

    <!-- Tree -->
    <EventTree
      :item="item"
      :max-depth="maxDepth"
    />

    <!-- Header -->
    <div class="w-full">
      <EventHeader
        class="cursor-pointer select-none pr-md"
        :node="item.node"
        :event="item.event"
        @mousedown="() => isOpen = !isOpen"
      />

      <!-- Body -->
      <Collapse v-model="isOpen">
        <div class="p-md">
          <DataSheet :model-value="item.event" />
        </div>
      </Collapse>
    </div>
  </div>
</template>
