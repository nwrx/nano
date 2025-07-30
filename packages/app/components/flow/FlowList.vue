<script setup lang="ts">
import AppPageFormEmpty from '~/components/app/AppPageForm.Empty.vue'
import { useFlows } from '~/composables/useFlow'
import FlowListItem from './FlowList.Item.vue'

const props = defineProps <{
  workspace: string
  project: string
}>()

const { t } = useI18n()
const flows = useFlows(props)
const flowsSorted = computed(() => flows.data.toSorted((a, b) => a.name.localeCompare(b.name)))

onMounted(() => {
  void flows.searchFlows()
  void flows.subscribeToEvents()
})

onBeforeUnmount(() => {
  void flows.unsubscribeFromEvents()
})
</script>

<template>
  <div class="space-y-md">
    <div v-if="flowsSorted.length > 0" class="bg-subtle">
      <FlowListItem
        v-for="flow in flowsSorted"
        :key="flow.name"
        :workspace="workspace"
        :project="project"
        :flow="flow"
        icon="i-carbon:flow"
        class="shrink-0"
      />
    </div>

    <!-- No Tools -->
    <Pattern v-else class="rd">
      <AppPageFormEmpty
        :title="t('noFlowsTitle')"
        :text="t('noFlowsText')"
        icon="i-carbon:flow"
      />
    </Pattern>

    <!-- Create -->
    <Hyperlink
      :label="t('createFlow')"
      class="text-sm my-md"
      icon-prepend="i-carbon:flow"
      icon-append="i-carbon:chevron-right"
      icon-expand
      @click="() => flows.createFlow()"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  createFlow: Create a new Flow in this Project
  noFlowsTitle: No Flows
  noFlowsText: This project does not contain any flows yet. Create a new flow to get started.
fr:
  createFlow: Créer un nouveau flux dans ce projet
  noFlowsTitle: Aucun Flux
  noFlowsText: Ce projet ne contient pas encore de flux. Créez un nouveau flux pour commencer.
de:
  createFlow: Einen neuen Flow in diesem Projekt erstellen
  noFlowsTitle: Keine Flows
  noFlowsText: Dieses Projekt enthält noch keine Flows. Erstellen Sie einen neuen Flow, um zu beginnen.
es:
  createFlow: Crear un nuevo flujo en este proyecto
  noFlowsTitle: Sin Flujos
  noFlowsText: Este proyecto aún no contiene flujos. Crea un nuevo flujo para comenzar.
zh:
  createFlow: 在此项目中创建新流程
  noFlowsTitle: 无流程
  noFlowsText: 此项目尚未包含任何流程。创建一个新流程以开始。
</i18n>
