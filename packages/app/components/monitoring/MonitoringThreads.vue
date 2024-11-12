<script setup lang="ts">
import type { MonitoringFlowThreadObject } from '@nwrx/api'

defineProps<{
  threads: MonitoringFlowThreadObject[]
  selectedFlow?: string
  selectedThread?: string
}>()

const emit = defineEmits<{
  select: [string]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="relative">

    <!-- Empty -->
    <MonitoringEmpty v-if="threads.length === 0">
      {{ t('noThreads') }}
    </MonitoringEmpty>

    <!-- List -->
    <ul v-else>
      <MonitoringItem
        v-for="thread in threads"
        :key="thread.id"
        :title="formatDateTime(thread.createdAt)"
        :text="thread.id"
        icon="i-carbon:checkmark"
        icon-class="text-success"
        :is-selected="thread.id === selectedThread"
        @click="() => emit('select', thread.id)"
      />
    </ul>
  </div>
</template>

<i18n lang="yaml">
en:
  noThreads: This flow was never executed.
  noSelectedFlow: Please select a flow to view its threads.
fr:
  noThreads: Ce flux n'a jamais été exécuté.
  noSelectedFlow: Veuillez sélectionner un flux pour afficher ses fils d'exécution.
de:
  noThreads: Dieser Ablauf wurde nie ausgeführt.
  noSelectedFlow: Bitte wählen Sie einen Ablauf aus, um seine Threads anzuzeigen.
es:
  noThreads: Este flujo nunca se ejecutó.
  noSelectedFlow: Seleccione un flujo para ver sus hilos
zh:
  noThreads: 此流程从未执行过。
  noSelectedFlow: 请选择一个流程以查看其线程。
</i18n>
