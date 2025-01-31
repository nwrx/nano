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
      <div class="w-full p-md pt-xs space-y-lg">
        <FlowEditorPanelSectionData
          :title="t('event.flow')"
          :label="t('event.flow')"
          :data="{
            [t('label.id')]: event.id,
            [t('label.event')]: event.event,
          }"
        />

        <!-- Data -->
        <FlowEditorPanelSectionData
          v-if="isOpen && event.event === 'node:end'"
          :title="t('event.node:end')"
          :data="event.data"
          :label="t('event.node:end.label')"
        />

        <!-- Result -->
        <FlowEditorPanelSectionData
          v-if="isOpen && event.event === 'node:end'"
          :title="t('event.node:end')"
          :data="event.result"
          :label="t('event.node:end.label')"
        />

        <!-- Error -->
        <FlowEditorPanelSectionData
          v-if="isOpen && event.event === 'node:error'"
          :title="t('event.node:error')"
          :data="{ Message: event.message }"
          :label="t('event.node:error.label')"
        />
      </div>
    </BaseCollapse>
  </div>
</template>

<i18n lang="yaml">
  en:
    label.id: ID
    label.event: Event
    event.flow:start: Start
    event.flow:end: Completed
    event.flow:abort: Aborted
    event.node:end: Node
    event.node:error: Error
  fr:
    label.id: ID
    label.event: Événement
    event.flow:start: Démarrage
    event.flow:end: Terminé
    event.flow:abort: Annulé
    event.node:end: Noeud
    event.node:error: Erreur
</i18n>
