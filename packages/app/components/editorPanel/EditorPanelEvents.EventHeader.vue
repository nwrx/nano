<script setup lang="ts">
import type { ComponentInstanceJSON, EditorSessionServerMessage } from '@nwrx/nano-api'

const props = defineProps<{
  event: EditorSessionServerMessage
  node?: ComponentInstanceJSON
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [boolean]
}>()

const { t } = useI18n()
const isOpen = useVModel(props, 'isOpen', emit, { passive: true })

function getBadgeClass(event: EditorSessionServerMessage): string {
  if (event.event === 'thread:nodeTrace') return 'badge-secondary'
  if (event.event === 'thread:nodeError') return 'badge-danger'
  if (event.event === 'thread:nodeEnd') return 'badge-success'
  if (event.event === 'thread:start') return 'badge-primary'
  if (event.event === 'thread:end') return 'badge-primary'
  return ''
}
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
      :class="getBadgeClass(event)"
      :label="t(event.event)"
      icon="i-carbon:dot-mark"
      icon-load
    />

    <!-- Node -->
    <Badge
      v-if="node"
      class="text-white"
      :style="{ backgroundColor: node.categoryColor }"
      :label="node.name"
      icon-load
    />

    <!-- Spacer -->
    <div class="grow" />

    <!-- Duration -->
    <div
      v-if="'delta' in event && typeof event.delta === 'number'"
      class="flex items-center space-x-md ml-auto text-end text-xs text-subtle">
      {{ event.delta }} ms
    </div>
  </BaseButton>
</template>

<i18n lang="yaml">
en:
  thread:start: Start
  thread:end: Completed
  thread:abort: Aborted
  thread:nodeError: Error
  thread:nodeEnd: Node
  thread:nodeTrace: Trace
fr:
  thread:start: Démarrage
  thread:end: Terminé
  thread:abort: Abandonné
  thread:nodeError: Erreur
  thread:nodeEnd: Noeud
  thread:nodeTrace: Trace
de:
  thread:start: Start
  thread:end: Abgeschlossen
  thread:abort: Abgebrochen
  thread:nodeError: Fehler
  thread:nodeEnd: Knoten
  thread:nodeTrace: Spur
es:
  thread:start: Inicio
  thread:end: Completado
  thread:abort: Abortado
  thread:nodeError: Error
  thread:nodeEnd: Nodo
  thread:nodeTrace: Rastro
zh:
  thread:start: 开始
  thread:end: 完成
  thread:abort: 已中止
  thread:nodeError: 错误
  thread:nodeEnd: 节点
  thread:nodeTrace: 跟踪
</i18n>
