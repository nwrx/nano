<script setup lang="ts">
import type { FlowNodeObject } from '@nwrx/nano-api'
import type { ThreadServerMessage } from '@nwrx/nano-runner'

defineProps<{
  message?: ThreadServerMessage
  node?: FlowNodeObject
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex items-center space-x-md h-8 px-md">

    <!-- Tag -->
    <h3
      v-if="node"
      class="flex items-center b h-6 rd whitespace-nowrap"
      :style="{
        borderColor: getComponentColor(node.component),
        backgroundColor: `${getComponentColor(node.component)}10`,
      }">

      <!-- Icon -->
      <div
        class="flex items-center justify-center aspect-1/1 h-full"
        :style="{ backgroundColor: getComponentColor(node.component) }">
        <BaseIcon
          load
          :icon="node.component.icon"
          class="size-4 text-white"
        />
      </div>
      <span class="font-mono px-sm text-sm truncate">
        {{ node.specifier }}
      </span>
    </h3>

    <!-- Text -->
    <span class="font-mono text-sm truncate">
      {{ t(`event.${message.event}.text`, { ...node }) }}
    </span>

    <!-- Error bar -->
    <div v-if="message.event === 'nodeError'" class="bg-danger-500 grow h-2 rd" />

    <!-- Spacer -->
    <div v-else class="grow" />

    <!-- Date -->
    <span class="font-mono text-xs text-subtle">
      {{ new Date().toLocaleTimeString() }}
    </span>
  </div>
</template>

<i18n lang="yaml">
en:
  event:
    nodeState:
      text: Node with ID {id} changed state to {state}.
    nodeStart:
      text: Node with ID {id} started.
    nodeDone:
      text: Node with ID {id} done.
    nodeError:
      text: Node with ID {id} errored.
</i18n>
