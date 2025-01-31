<!-- eslint-disable sonarjs/prefer-single-boolean-return -->
<script setup lang="ts">
import type { MonitoringFlowThreadEventObject, MonitoringFlowThreadNodeEventObject } from '@nwrx/nano-api'

const props = defineProps<{
  selectedEvent?: string
  selectedThread?: string
  events?: MonitoringFlowThreadEventObject[]
  nodeEvents?: MonitoringFlowThreadNodeEventObject[]
  eventNames?: string[]
  eventTypes?: string[]
}>()

const emit = defineEmits<{
  'update:eventNames': [string[]]
  'update:eventTypes': [string[]]
}>()

const { t } = useI18n()
const types = useVModel(props, 'eventTypes', emit, { passive: true, defaultValue: [] })
const names = useVModel(props, 'eventNames', emit, { passive: true, defaultValue: [] })

const allEvents = computed(() => [
  ...(props.events ?? []).map(x => ({ type: 'thread', ...x })),
  ...(props.nodeEvents ?? []).map(x => ({ type: 'node', ...x })),
]
  .filter((x) => {
    if (types.value && types.value.length > 0 && !types.value.includes(x.type)) return false
    if (names.value && names.value.length > 0 && !names.value.includes(x.event)) return false
    return true
  })

  // --- Ofset the delta by 1 so the event is always displayed last
  .map(x => ({ ...x, delta: x.event === 'end' && x.type === 'thread' ? x.delta + 1 : x.delta }))
  .map(x => ({ ...x, delta: x.event === 'error' && x.type === 'node' ? x.delta + 1 : x.delta }))
  .sort((a, b) => a.delta - b.delta))

const isEmpty = computed(() => props.nodeEvents?.length === 0 && props.events?.length === 0)
const isEmptyAfterFilter = computed(() => allEvents.value.length === 0)
</script>

<template>
  <div class="flex flex-col items-stretch h-full">

    <div class="px-md py-sm bg-app b-b b-app">
      <div class="flex items-center rd overflow-hidden">
        <MonitoringToggle v-model="types" value="thread" icon="i-carbon:flow" />
        <MonitoringToggle v-model="types" value="node" icon="i-carbon:box" />
        <MonitoringToggle v-model="names" value="start" icon="i-carbon:play-outline" />
        <MonitoringToggle v-model="names" value="end" icon="i-carbon:checkmark-outline" />
        <MonitoringToggle v-model="names" value="error" icon="i-carbon:error-outline" />
      </div>
    </div>

    <!-- No selected event -->
    <div class="relative grow">
      <MonitoringEmpty v-if="!selectedThread" :text="t('noSelectedThread')" />
      <MonitoringEmpty v-else-if="isEmpty" :text="t('empty')" />
      <MonitoringEmpty v-else-if="isEmptyAfterFilter" :text="t('emptyAfterFilter')" />
      <!-- List -->
      <ul v-else>
        <MonitoringEventsDetail
          v-for="event in allEvents"
          :key="event.id"
          :type="event.type"
          :event="event"
        />
      </ul>
    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  noSelectedThread: Please select a thread to view its events.
  empty: This thread did not produce any events.
  emptyAfterFilter: There are no events matching the selected filters.
fr:
  noSelectedThread: Veuillez sélectionner un fil d'exécution pour afficher ses événements.
  empty: Ce fil d'exécution n'a produit aucun événement.
  emptyAfterFilter: Aucun événement ne correspond aux filtres sélectionnés.
de:
  noSelectedThread: Bitte wählen Sie einen Thread aus, um seine Ereignisse anzuzeigen.
  empty: Dieser Thread hat keine Ereignisse erzeugt.
  emptyAfterFilter: Keine Ereignisse entsprechen den ausgewählten Filtern.
es:
  noSelectedThread: Seleccione un hilo para ver sus eventos.
  empty: Este hilo no produjo ningún evento.
  emptyAfterFilter: No hay eventos que coincidan con los filtros seleccionados.
zh:
  noSelectedThread: 请选择一个线程以查看其事件。
  empty: 此线程未产生任何事件。
  emptyAfterFilter: 没有与所选筛选器匹配的事件。
</i18n>
