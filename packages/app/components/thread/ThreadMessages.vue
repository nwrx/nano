<!-- eslint-disable sonarjs/no-nested-assignment -->
<script setup lang="ts">
import type { ThreadInputObject } from '@nwrx/nano'
import type { FlowNodeObject } from '@nwrx/nano-api'
import type { ThreadServerMessage } from '@nwrx/nano-runner'
import type { Schema } from '@nwrx/nano/utils'
import Button from '../base/Button.vue'
import DataSheetRow from '../base/DataSheet.Row.vue'
import DataSheet from '../base/DataSheet.vue'
import EditorFab from '../editor/EditorFab.vue'
import ThreadMessagesMessage from './ThreadMessages.Message.vue'

const props = withDefaults(
  defineProps<{
    nodes?: FlowNodeObject[]
    messages?: ThreadServerMessage[]
    schema?: Record<string, Schema>
  }>(),
  {
    messages: () => [],
    schema: () => ({
      Message: {
        type: 'string',
        title: 'Message',
        description: 'The message to send.',
      },
    }),
  },
)

const emit = defineEmits<{
  startThread: [ThreadInputObject]
}>()

// --- Given a message, get the node that originated it.
function getMessageNode(message: ThreadServerMessage) {
  if (!props.nodes) return
  if (!message.event.startsWith('node')) return
  // @ts-expect-error: index 0 is expected to be the node id.
  const id = message.data[0]
  if (typeof id !== 'string') return
  return props.nodes.find(node => node.id === id)
}

// --- Reactive V-model.
const value = defineModel<ThreadInputObject>({ default: () => ({}) })
</script>

<template>
  <div class="flex items-stretch h-full">
    <div class="flex flex-col grow h-full select-text relative">

      <div class="overflow-auto flex-grow pt-md px-md pb-xl">
        <ThreadMessagesMessage
          v-for="(message, index) in messages"
          :key="index"
          :message="message"
          :node="getMessageNode(message)"
        />
      </div>

      <!-- Dirty Alert -->
      <!--
        <div class="flex space-x-md p-md b rd hint hint-warning">
        <BaseIcon icon="i-carbon:warning" class="size-4 shrink-0 mt-xs" />
        <p class="text-sm">
        The current state of the flow does not match the state of the current thread,
        please synchronize the flow before sending a message.
        </p>
        </div>
      -->

      <!-- Input section -->
      <div class="flex items-stretch space-x-md p-md b-t b-app">
        <DataSheet>
          <DataSheetRow
            v-for="(field, name) in schema"
            :key="name"
            v-model="value[name]"
            :name="field.title ?? name"
            :is-editable="true"
          />
        </DataSheet>

        <!-- Send button -->
        <Button
          class="button-light"
          icon-append="i-carbon:send"
          @click="() => emit('startThread', value)">
          Send
        </Button>
      </div>
    </div>

    <!-- Vertical fabs -->
    <div class="flex flex-col items-center b-l b-app">
      <EditorFab class="!size-12" icon="i-carbon:chat" />
      <EditorFab class="!size-12" icon="i-carbon:data-view" />
      <EditorFab class="!size-12" icon="i-carbon:code" />
      <EditorFab class="!size-12" icon="i-carbon:repo-artifact" />
    </div>
  </div>
</template>
