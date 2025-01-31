<script setup lang="ts">
import type {
  MonitoringFlowThreadEventObject,
  MonitoringFlowThreadNodeEventObject,
} from '@nwrx/api'

const props = defineProps<{
  isOpen: boolean
  type: string
  event: MonitoringFlowThreadEventObject | MonitoringFlowThreadNodeEventObject
}>()

const emit = defineEmits<{
  click: []
}>()

const { t } = useI18n()

const typeBadgeClass = computed(() => {
  if (props.event.event === 'error') return 'badge-danger'
  if (props.type === 'node') return 'badge-success'
  if (props.type === 'thread') return 'badge-primary'
})
</script>

<template>
  <BaseButton
    eager
    class="
      flex items-center px-md py-sm space-x-sm w-full
      cursor-pointer bg-app  select-none transition-colors
      b b-transparent b-b-app
    "
    @click="() => emit('click')">

    <!-- Dot -->
    <BaseIcon
      icon="i-carbon:chevron-down"
      :class="{ 'rotate-180': isOpen }"
      class="size-5 text-prominent transition shrink-0"
    />

    <!-- Type -->
    <Badge class="shrink-0" :class="typeBadgeClass" icon="i-carbon:dot-mark">
      {{ t(type) }}
    </Badge>

    <!-- Event -->
    <Badge v-if="type === 'node'" class="shrink-0">
      {{ (event as MonitoringFlowThreadNodeEventObject).kind }}
    </Badge>

    <!-- Title -->
    <p class="text-sm font-mono shrink-0">
      {{ t(`${type}_${event.event}`, event as any) }}
    </p>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Text -->
    <p class="flex items-center space-x-xs truncate">
      <BaseIcon icon="i-carbon:time" class="size-3 shrink-0" />
      <span class="text-xs font-medium text-subtle">{{ event.delta }}ms</span>
    </p>
  </BaseButton>
</template>

<i18n lang="yaml">
en:
  node: Node
  node_start: Started
  node_end: Completed in { duration }ms
  node_error: An error occurred
  thread: Thread
  thread_start: Started
  thread_end: Completed
fr:
  node: Noeud
  node_start: Démarré
  node_end: Terminé en { duration }ms
  node_error: Une erreur est survenue
  thread: Fil d'exécution
  thread_start: Démarrage
  thread_end: Terminé
de:
  node: Knoten
  node_start: Gestartet
  node_end: Abgeschlossen in { duration }ms
  node_error: Ein Fehler ist aufgetreten
  thread: Thread
  thread_start: Gestartet
  thread_end: Abgeschlossen
es:
  node: Nodo
  node_start: Iniciado
  node_end: Completado en { duration }ms
  node_error: Se produjo un error
  thread: Hilo
  thread_start: Iniciado
  thread_end: Completado
zh:
  node: 节点
  node_start: 已启动
  node_end: 在 { duration }ms 内完成
  node_error: 发生错误
  thread: 线程
  thread_start: 已启动
  thread_end: 已完成
</i18n>
