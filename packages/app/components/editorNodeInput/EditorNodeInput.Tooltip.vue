<!-- eslint-disable @typescript-eslint/prefer-nullish-coalescing -->
<script setup lang="ts">
import type { Schema } from '@nwrx/nano/utils'
import { vMarkdown } from '~/utils/vMarkdown'

const props = defineProps<{
  name?: string
  path?: string
  schema?: Schema
}>()

const type = computed(() => {
  if (!props.schema) return 'MISSING_SCHEMA_PROP'
  return getSchemaType(props.schema)
})

const fullName = computed(() => (
  [props.name, props.path].filter(Boolean).join('.') || 'MISSING_NAME_PROP'
))
</script>

<template>
  <div class="w-100 divide-y divide-editor">

    <!-- Description -->
    <p
      v-if="schema?.description"
      v-markdown.html="schema.description"
      class="p-md text-app max-h-80 overflow-y-auto markdown"
      @wheel.stop
    />

    <!-- Type and Name -->
    <p class="px-md py-sm font-medium text-app">
      ({{ type }}) {{ fullName }}
    </p>
  </div>
</template>
