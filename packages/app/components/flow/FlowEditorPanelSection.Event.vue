<script setup lang="ts">
import type { FlowSessionEventPayload, NodeInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  event: FlowSessionEventPayload
  nodes: NodeInstanceJSON[]
}>()

// --- Localization
const { t } = useI18n()
const isOpen = ref(false)
const node = computed(() => props.nodes.find(node => node.id === props.event.id))
</script>

<template>
  <div
    class="flex flex-col items-start border-editor not-first:border-t"
    :class="{ '!bg-subtle/50': isOpen }">

    <!-- Header -->
    <BaseButton
      eager
      class="flex items-center font-medium px py-sm transition w-full cursor-pointer"
      :class="{ 'hover:bg-subtle/50': !isOpen }"
      @click="() => { isOpen = !isOpen }">
      <Badge
        class="badge-soft badge-secondary mr-sm"
        :label="t(`event.${event.event}`, event as any)"
        icon="i-carbon:dot-mark"
        iconLoad
      />
      <Badge
        v-if="node"
        class="text-white"
        :style="{ backgroundColor: node.categoryColor }"
        :label="node?.name || t(`event.node:${event.event}`, event as any)"
        iconLoad
      />
      <!-- Duration -->
      <div v-if="'duration' in event" class="flex items-center space-x-md ml-auto text-end">
        <p v-if="'id' in event" class="w-40 text-xs font-normal text-subtle truncate">{{ event.id }}</p>
        <p class="w-12 text-xs text-subtle">{{ event.duration }}ms</p>
      </div>
    </BaseButton>

    <!-- Content -->
    <BaseCollapse
      vertical
      :isOpen="isOpen"
      class="w-full transition-all"
      :class="{ 'opacity-0': !isOpen }">

      <!-- Meta -->
      <div class="w-full p-md pt-xs space-y-sm">
        <FlowEditorPanelSectionData
          :title="t('event.flow')"
          :label="t('event.flow')"
          :data="{
            [t('label.id')]: 'id' in event ? event.id : '',
            [t('label.event')]: event.event,
          }"
        />

        <!-- Data -->
        <FlowEditorPanelSectionData
          v-if="isOpen && event.event === 'node:end'"
          :title="t('event.node:end')"
          :label="t('event.node:end.result')"
          :data="event.data"
        />

        <!-- Result -->
        <FlowEditorPanelSectionData
          v-if="isOpen && event.event === 'node:end'"
          :title="t('event.node:end')"
          :label="t('event.node:end.data')"
          :data="event.result"
        />

        <!-- Error -->
        <FlowEditorPanelSectionData
          v-if="isOpen && event.event === 'node:error'"
          :title="t('event.node:error')"
          :label="t('event.node:error.error')"
          :data="{ Message: event.message }"
        />
      </div>
    </BaseCollapse>
  </div>
</template>

<i18n lang="yaml">
  en:
    label.id: ID
    label.event: Event
    event.flow: Flow
    event.flow:start: Start
    event.flow:end: Completed
    event.flow:abort: Aborted
    event.node:end: Node
    event.node:error: Error
    event.node:end.result: Result
    event.node:end.data: Data
    event.node:error.error: Error
  fr:
    label.id: ID
    label.event: Événement
    event.flow: Flux
    event.flow:start: Démarrage
    event.flow:end: Terminé
    event.flow:abort: Annulé
    event.node:end: Noeud
    event.node:error: Erreur
    event.node:end.result: Résultat
    event.node:end.data: Données
    event.node:error.error: Erreur
  de:
    label.id: ID
    label.event: Ereignis
    event.flow: Fluss
    event.flow:start: Start
    event.flow:end: Abgeschlossen
    event.flow:abort: Abgebrochen
    event.node:end: Knoten
    event.node:error: Fehler
    event.node:end.result: Ergebnis
    event.node:end.data: Daten
    event.node:error.error: Fehler
  es:
    label.id: ID
    label.event: Evento
    event.flow: Flujo
    event.flow:start: Comienzo
    event.flow:end: Completado
    event.flow:abort: Abortado
    event.node:end: Nodo
    event.node:error: Error
    event.node:end.result: Resultado
    event.node:end.data: Datos
    event.node:error.error: Error
  zh:
    label.id: ID
    label.event: 事件
    event.flow: 流程
    event.flow:start: 开始
    event.flow:end: 完成
    event.flow:abort: 已中止
    event.node:end: 节点
    event.node:error: 错误
    event.node:end.result: 结果
    event.node:end.data: 数据
    event.node:error.error: 错误
</i18n>
