<script setup lang="ts">
import { vMarkdown } from '#imports';

defineProps<{
  name: string
  value: unknown
}>()

const asMarkdown = ref(false)
</script>

<template>
  <div class="flex flex-wrap items-stretch text-sm not-first:border-t border-editor">

    <!-- Name -->
    <div class="w-3/12 px-sm py-xs border-r border-editor font-sans">
      {{ name }}
    </div>

    <!-- $NODE. -->
    <div
      v-if="typeof value === 'string' && value.startsWith('$NODE.')"
      class="flex items-center px-sm truncate">
      <span class="font-mono">Link from {{ value.split(':').pop() }}</span>
    </div>

    <!-- $VARIABLE. -->
    <div
      v-else-if="typeof value === 'string' && value.startsWith('$VARIABLE.')"
      class="flex items-center px-sm w-2/3 truncate">
      <div class="flex items-center justify-center bg-primary-500 text-layout size-5 rounded mr-sm">
        <BaseIcon icon="i-carbon:code" class="size-3" />
      </div>
      <span class="font-mono">{{ value.split('.').pop() }}</span>
    </div>

    <!-- $SECRET. -->
    <div
      v-else-if="typeof value === 'string' && value.startsWith('$SECRET.')"
      class="flex items-center px-sm w-2/3 truncate">
      <BaseIcon icon="i-carbon:ibm-cloud-key-protect" class="size-4 mr-1" />
      <span class="font-mono">{{ value.split('.').pop() }}</span>
    </div>

    <!-- String -->
    <div
      v-else-if="typeof value === 'string'"
      class="w-9/12 p-xs whitespace-pre-wrap max-h-128 overflow-y-auto relative">

      <!-- Markdown -->
      <span
        v-if="asMarkdown"
        class="line-height-tight"
        v-markdown="value"
      />

      <!-- Raw -->
      <span
        v-else
        class="font-mono"
        v-text="value"
      />
    </div>

    <!-- Boolean -->
    <Badge
      v-else-if="typeof value === 'boolean'"
      class="ml-xs !h-5 truncate badge-soft font-mono"
      :class="value ? 'badge-success' : 'badge-danger'"
      :label="value ? 'True' : 'False'"
    />

    <!-- Object -->
    <template v-else-if="typeof value === 'object'">
      <div class="w-full border-t border-editor"/>
      <template v-for="(value, key) in value">
        <div class="w-3/12 px-sm py-xs truncate font-mono border-r border-editor">{{ key }}</div>
        <div class="w-9/12 px-sm py-xs truncate font-mono">{{ value }}</div>
      </template>
    </template>
  </div>
</template>
