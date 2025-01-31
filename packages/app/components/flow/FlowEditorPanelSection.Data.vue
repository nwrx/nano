<script setup lang="ts">
import Markdown from 'markdown-it'

const props = defineProps<{
  data: Array<{ name: string; value: unknown }>
  title: string
  text?: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const isOpen = useVModel(props, 'isOpen', emit, { passive: true })
const md = new Markdown({
  html: true,
  linkify: true,
  typographer: true,
})
</script>

<template>
  <FlowEditorPanelSection
    v-model="isOpen"
    :title="title"
    :text="text"
    class-content="group space-y-2">

    <div class="border border-black/10 rounded select-text bg-black/5">
      <div v-for="entry in data" class="flex flex-wrap not-first:border-t border-black/10 rounded">
        <div class="text-sm w-4/12 px-2 py-1 border-black/10 font-sans">{{ entry.name }}</div>

        <!-- Object -->
        <template v-if="typeof entry.value === 'object'">
          <div class="w-full border-t border-black/10"/>
          <template v-for="(value, key) in entry.value">
            <div class="text-sm w-4/12 px-2 py-1 font-mono border-r border-black/10">{{ key }}</div>
            <div class="text-sm w-8/12 px-2 py-1 font-mono">{{ value }}</div>
          </template>
        </template>

        <!-- $NODE. -->
        <div
          v-else-if="typeof entry.value === 'string' && entry.value.startsWith('$NODE.')"
          class="flex items-center px-2 text-xs w-2/3 truncate">
          <span class="font-mono">Link from {{ entry.value.split(':').pop() }}</span>
        </div>

        <!-- String -->
        <div
          v-else-if="typeof entry.value === 'string'"
          class="text-sm w-8/12 px-2 py-1 font-mono whitespace-pre-wrap max-h-128 overflow-y-auto"
          v-html="md.render(entry.value).trim()"
        />
      </div>
    </div>

  </FlowEditorPanelSection>
</template>
