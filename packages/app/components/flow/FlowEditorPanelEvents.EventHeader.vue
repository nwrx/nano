<script setup lang="ts">
import type { FlowSessionEventPayload, NodeInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  event: FlowSessionEventPayload
  node?: NodeInstanceJSON
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [boolean]
}>()

const { t } = useI18n()
const isOpen = useVModel(props, 'isOpen', emit, { passive: true })
</script>

<template>
  <BaseButton
    eager
    class="flex items-center w-full font-medium px py-sm transition cursor-pointer"
    :class="{ 'hover:bg-emphasized': !isOpen }"
    @click="() => { isOpen = !isOpen }">

    <!-- Event Type -->
    <Badge
      class="mr-sm"
      :class="{
        'badge-danger': event.event === 'node:error',
        'badge-success': event.event === 'node:end',
        'badge-primary': event.event === 'flow:start' || event.event === 'flow:end',
      }"
      :label="t(event.event)"
      icon="i-carbon:dot-mark"
      iconLoad
    />

    <!-- Node -->
    <Badge
      v-if="node"
      class="text-white"
      :style="{ backgroundColor: node.categoryColor }"
      :label="node.name"
      iconLoad
    />

    <!-- Spacer -->
    <div class="grow" />

    <!-- Duration -->
    <div v-if="'delta' in event && typeof event.delta === 'number'" class="flex items-center space-x-md ml-auto text-end">
      <p class="text-xs text-subtle">{{ event.delta }} ms</p>
    </div>
  </BaseButton>
</template>

<i18n lang="yaml">
  en:
    flow:start: Start
    flow:end: Completed
    flow:abort: Aborted
    node:error: Error
    node:end: Node
  fr:
    flow:start: Démarrage
    flow:end: Terminé
    flow:abort: Abandonné
    node:error: Erreur
    node:end: Noeud
  de:
    flow:start: Start
    flow:end: Beendet
    flow:abort: Abgebrochen
    node:error: Fehler
    node:end: Knoten
  es:
    flow:start: Inicio
    flow:end: Completado
    flow:abort: Abortado
    node:error: Error
    node:end: Nodo
  zh:
    flow:start: 开始
    flow:end: 完成
    flow:abort: 已中止
    node:error: 错误
    node:end: 节点
</i18n>
