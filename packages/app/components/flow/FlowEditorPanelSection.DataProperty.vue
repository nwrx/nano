<script setup lang="ts">
import Markdown from 'markdown-it'

defineProps<{
  name: string
  value: unknown
}>()

const md = new Markdown({
  html: true,
  linkify: true,
  typographer: true,
})
</script>

<template>
  <div class="flex flex-wrap">

    <!-- Name -->
    <div class="text-sm w-4/12 px-sm py-xs border-r border-app font-sans">
      {{ name }}
    </div>

    <!-- Object -->
    <template v-if="typeof value === 'object'">
      <div class="w-full border-t border-black/10"/>
      <template v-for="(value, key) in value">
        <div class="text-sm w-4/12 px-sm py-xs truncate font-mono border-r border-black/10">{{ key }}</div>
        <div class="text-sm w-8/12 px-sm py-xs truncate font-mono">{{ value }}</div>
      </template>
    </template>

    <!-- $NODE. -->
    <div
      v-else-if="typeof value === 'string' && value.startsWith('$NODE.')"
      class="flex items-center px-sm w-2/3 truncate">
      <span class="font-mono">Link from {{ value.split(':').pop() }}</span>
    </div>

    <!-- $VARIABLE. -->
    <div
      v-else-if="typeof value === 'string' && value.startsWith('$VARIABLE.')"
      class="flex items-center px-sm w-2/3 truncate">
      <div class="flex items-center justify-center bg-layout text-layout px-.5 py-.25 rounded mr-1">
        <BaseIcon icon="i-carbon:tag" class="size-4" />
      </div>
      <span class="text-sm font-mono">{{ value.split('.').pop() }}</span>
    </div>

    <!-- $SECRET. -->
    <div
      v-else-if="typeof value === 'string' && value.startsWith('$SECRET.')"
      class="flex items-center px-sm w-2/3 truncate">
      <BaseIcon icon="i-carbon:ibm-cloud-key-protect" class="size-4 mr-1" />
      <span class="text-sm font-mono">{{ value.split('.').pop() }}</span>
    </div>

    <!-- String -->
    <div
      v-else-if="typeof value === 'string'"
      class="text-sm w-8/12 px-sm py-xs font-mono whitespace-pre-wrap max-h-128 overflow-y-auto"
      v-html="md.render(value).trim()"
    />
  </div>
</template>
