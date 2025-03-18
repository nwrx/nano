<script setup lang="ts">
defineProps<{
  item: EditorMessageTreeItem
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex items-center space-x-md h-8">

    <!-- Tag -->
    <h3
      v-if="item.node"
      class="flex items-center b h-6 rd whitespace-nowrap"
      :style="{
        borderColor: getNodeColor(item.node),
        backgroundColor: `${getNodeColor(item.node)}10`,
      }">

      <!-- Icon -->
      <div
        class="flex items-center justify-center aspect-1/1 h-full"
        :style="{ backgroundColor: getNodeColor(item.node) }">
        <BaseIcon
          load
          :icon="item.node.icon"
          class="size-4 text-white"
        />
      </div>
      <span class="font-mono px-sm text-sm truncate">
        {{ item.node.specifier }}
      </span>
    </h3>

    <!-- Text -->
    <span class="font-mono text-sm truncate">
      {{ t(`event.${item.message.event}.text`, { ...item.node }) }}
    </span>

    <!-- Spacer -->
    <div class="grow" />

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
