<script setup lang="ts">
import type { ChatThreadObject, WorkspaceProjectObject } from '@nwrx/api'
import type { UUID } from 'node:crypto'

const props = defineProps<{
  threads?: ChatThreadObject[]
  projects?: WorkspaceProjectObject[]
  search?: string
}>()

const emit = defineEmits<{
  createThread: [project: string, flow: string]
  openThread: [id: UUID]
  archiveThread: [id: UUID]
  renameThread: [id: UUID, title: string]
  deleteThread: [id: UUID]
  'update:search': [value: string]
}>()

const { t } = useI18n()
const search = useVModel(props, 'search', emit, { passive: true })
</script>

<template>
  <div class="b-r b-app">

    <!-- Header -->
    <div class="b-b b-app flex items-center justify-between p-md">
      <InputText
        v-model="search"
        type="text"
        :placeholder="t('search')"
        icon="i-carbon:search"
      />
    </div>

    <!-- Projects -->
    <template v-if="projects">
      <ChatPanelProject
        v-for="project in projects.filter(p => p.flows?.length)"
        :key="project.name"
        :project="project"
        @open="(project, flow) => emit('createThread', project, flow)"
      />
    </template>

    <!-- Content -->
    <ChatPanelThread
      v-for="thread in threads"
      :id="thread.id"
      :key="thread.id"
      :name="thread.title"
      @click="() => emit('openThread', thread.id)"
      @archive="() => emit('archiveThread', thread.id)"
      @delete="() => emit('deleteThread', thread.id)"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  search: Search
fr:
  search: Rechercher
de:
  search: Suche
es:
  search: Buscar
zh:
  search: 搜索
</i18n>
