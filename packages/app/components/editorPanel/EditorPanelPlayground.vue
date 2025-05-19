<script setup lang="ts">
import type { ThreadInputObject } from '@nwrx/nano'
import type { FlowNodeObject } from '@nwrx/nano-api'
import type { ThreadServerMessage } from '@nwrx/nano-runner'
import ThreadMessages from '../thread/ThreadMessages.vue'

defineProps<{
  messages?: ThreadServerMessage[]
  nodes?: FlowNodeObject[]
}>()

const emit = defineEmits<{
  startThread: [ThreadInputObject]
}>()
</script>

<template>
  <ThreadMessages
    :messages="messages"
    :nodes="nodes"
    @start-thread="(input) => emit('startThread', input)"
  />
</template>
