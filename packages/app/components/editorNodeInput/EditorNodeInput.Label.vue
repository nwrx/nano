<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'

const props = defineProps<{
  editor: Editor
  node: EditorNodeObject
  name: string
}>()

const schema = computed(() => props.node.inputs[props.name])
</script>

<template>
  <p class="text-sm truncate text-subtle shrink-0 mr-sm font-mono">
    {{ schema.title ?? name }} ‒
  </p>
</template>
