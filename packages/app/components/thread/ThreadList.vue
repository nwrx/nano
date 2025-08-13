<script setup lang="ts">
import type { UUID } from 'node:crypto'
import Panel from '~/components/base/Panel.vue'
import { useThreads } from '~/composables/useThread'
import AppPageFormEmpty from '../app/AppPageForm.Empty.vue'
import ThreadListGroup from './ThreadList.Group.vue'

const props = defineProps<{
  workspace: string
  project: string
  flow: string
}>()

const { t } = useI18n()
const threads = useThreads(props)
const selectedThread = defineModel<UUID>()
threads.options.withCreatedBy = true
threads.options.withUpdatedBy = true
threads.options.limit = 1000

onMounted(async() => {
  await threads.search()
})
</script>

<template>
  <Panel class="w-full overflow-y-auto overflow-x-clip">
    <!-- Empty -->
    <AppPageFormEmpty
      v-if="threads.data.length === 0"
      title="No threads available"
      text="There are no threads available at the moment."
      icon="i-carbon:flow"
    />

    <!-- Threads -->
    <template v-else>
      <ThreadListGroup
        v-for="(group) in threads.threadsByDate"
        :key="group.type"
        v-model="selectedThread"
        :threads="group.threads"
        :label="t(group.type)"
        :icon="group.icon"
      />
    </template>
  </Panel>
</template>

<i18n lang="yaml">
en:
  noThreads: No threads available
  lastHour: Last Hour
  today: Today
  thisWeek: This Week
  older: Older
fr:
  noThreads: Aucun thread disponible
  lastHour: Dernière heure
  today: Aujourd'hui
  thisWeek: Cette semaine
  older: Plus ancien
de:
  noThreads: Keine Threads verfügbar
  lastHour: Letzte Stunde
  today: Heute
  thisWeek: Diese Woche
  older: Älter
es:
  noThreads: No hay hilos disponibles
  lastHour: Última hora
  today: Hoy
  thisWeek: Esta semana
  older: Más antiguos
zh:
  noThreads: 没有可用的线程
  lastHour: 最近一小时
  today: 今天
  thisWeek: 本周
  older: 更早
</i18n>
