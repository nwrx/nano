<script setup lang="ts">
import type { FlowSessionEventPayload, FlowThreadNodeJSON } from '@nwrx/api'

const props = defineProps<{
  event: FlowSessionEventPayload
  node?: FlowThreadNodeJSON
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
        'badge-danger': event.event === 'thread:nodeError',
        'badge-success': event.event === 'thread:nodeEnd',
        'badge-primary': event.event === 'flowStart' || event.event === 'end',
      }"
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
    <div v-if="'delta' in event && typeof event.delta === 'number'" class="flex items-center space-x-md ml-auto text-end">
      <p class="text-xs text-subtle">
        {{ event.delta }} ms
      </p>
    </div>
  </BaseButton>
</template>

<i18n lang="yaml">
en:
  start: Start
  end: Completed
  abort: Aborted
  thread:nodeError: Error
  thread:nodeEnd: Node
fr:
  start: Démarrage
  end: Terminé
  abort: Abandonné
  thread:nodeError: Erreur
  thread:nodeEnd: Noeud
de:
  start: Start
  end: Beendet
  abort: Abgebrochen
  thread:nodeError: Fehler
  thread:nodeEnd: Knoten
es:
  start: Inicio
  end: Completado
  abort: Abortado
  thread:nodeError: Error
  thread:nodeEnd: Nodo
zh:
  start: 开始
  end: 完成
  abort: 已中止
  thread:nodeError: 错误
  thread:nodeEnd: 节点
</i18n>
