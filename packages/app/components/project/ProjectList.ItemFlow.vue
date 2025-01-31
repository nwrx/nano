<script setup lang="ts">
import type { FlowObject } from '@nwrx/nano-api'
import BOOKMARK_1_URL from '~/assets/bookmark-1.png'

const props = defineProps<FlowObject & {
  workspace: string
  project: string
}>()

const emit = defineEmits<{
  delete: []
  duplicate: []
}>()

const { t } = useI18n()

function getFlowRoute(workspace: string, project: string, flow: string) {
  if (!workspace || !project || !flow) return
  return {
    name: 'ProjectFlowEditor',
    params: { workspace, project, flow },
  }
}

function getChatRoute(workspace: string, project: string, flow: string) {
  if (!workspace || !project || !flow) return
  return {
    name: 'WorkspaceChat',
    params: { workspace, project, flow, thread: 'new' },
  }
}
</script>

<template>
  <div
    class="
      flex items-center justify-between p-md pr-xl rd space-x-md transition
      ring ring-transparent hover:bg-emphasized hover:ring-prominent
    ">

    <!-- Image -->
    <img
      :src="BOOKMARK_1_URL"
      alt="Bookmark"
      class="size-24 b b-app rd">

    <!-- Left - Name & Description -->
    <div class="w-full">
      <div class="flex items-center space-x-md">
        <Hyperlink
          eager
          icon="i-carbon:flow"
          :label="title"
          :to="getFlowRoute(workspace, project, name)"
          class="font-medium text-left whitespace-nowrap"
        />
      </div>

      <!-- Description -->
      <p class="text-sm text-subtle text-left line-clamp-2">
        {{ description }}
      </p>

      <!-- Status -->
      <ProjectFlowBadges v-bind="props" />
    </div>

    <!-- Right - Statistics -->
    <div class="flex items-center justify-center space-x-md shrink-0">
      <div class="flex divide-x divide-app grow lt-md:hidden">
        <ProjectListItemStatistic
          v-for="(statistic, key) in statistics"
          :key="key"
          :name="key"
          :trend="statistic.trend"
          :value="statistic.value"
          class="not-first:pl-lg not-last:pr-lg"
        />
      </div>

      <!-- CTA -->
      <ContextMenu x="right" y="top">
        <template #menu="{ close }">
          <ContextMenuItem
            :label="t('menu.chat')"
            icon="i-carbon:chat-bot"
            keybind="Enter"
            :to="getChatRoute(workspace, project, name)"
          />
          <ContextMenuItem
            :label="t('menu.edit')"
            icon="i-carbon:edit"
            keybind="Ctrl + E"
            :to="getFlowRoute(workspace, project, name)"
          />
          <ContextMenuItem
            :label="t('menu.delete')"
            icon="i-carbon:delete"
            keybind="Backspace"
            @click="() => { emit('delete'); close() }"
          />
          <ContextMenuItem
            :label="t('menu.duplicate')"
            icon="i-carbon:copy"
            keybind="Ctrl + D"
            @click="() => { emit('duplicate'); close() }"
          />
          <ContextMenuDivider />
          <ContextMenuItem
            :label="t('menu.export')"
            icon="i-carbon:download"
            keybind="Ctrl + E"
          />
          <ContextMenuItem
            :label="t('menu.publish')"
            icon="i-carbon:upload"
            keybind="Ctrl + B"
          />
          <ContextMenuItem
            :label="t('menu.settings')"
            icon="i-carbon:settings"
            keybind="Ctrl + ,"
            @click="() => close()"
          />
        </template>
      </ContextMenu>
    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  menu.chat: Chat
  menu.edit: Edit
  menu.delete: Delete
  menu.duplicate: Duplicate
  menu.export: Export
  menu.publish: Publish
  menu.settings: Settings
fr:
  menu.chat: Chat
  menu.edit: Modifier
  menu.delete: Supprimer
  menu.duplicate: Dupliquer
  menu.export: Exporter
  menu.publish: Publier
  menu.settings: Paramètres
de:
  menu.chat: Chat
  menu.edit: Bearbeiten
  menu.delete: Löschen
  menu.duplicate: Duplizieren
  menu.export: Exportieren
  menu.publish: Veröffentlichen
  menu.settings: Einstellungen
es:
  menu.chat: Chat
  menu.edit: Editar
  menu.delete: Eliminar
  menu.duplicate: Duplicar
  menu.export: Exportar
  menu.publish: Publicar
  menu.settings: Ajustes
zh:
  menu.chat: Chat
  menu.edit: 编辑
  menu.delete: 删除
  menu.duplicate: 复制
  menu.export: 导出
  menu.publish: 发布
  menu.settings: 设置
</i18n>
