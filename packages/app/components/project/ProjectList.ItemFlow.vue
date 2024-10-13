<script setup lang="ts">
defineProps<{
  workspace: string
  project: string
  name: string
  title: string
  icon?: string
  imageUrl?: string
  description?: string
  isDraft?: boolean
  isDeployed?: boolean
  isRunning?: boolean
}>()

const emit = defineEmits<{
  delete: []
  duplicate: []
}>()

const { t } = useI18n({ useScope: 'local' })

function getFlowRoute(workspace: string, project: string, flow: string) {
  if (!workspace || !project || !flow) return
  return {
    name: 'FlowEditor',
    params: { workspace, project, flow },
  }
}
</script>

<template>
  <div
    class="
      flex items-center justify-between p-md pr-xl rd space-x-md transition
      ring ring-transparent hover:bg-emphasized hover:ring-prominent
    ">

    <!-- Left - Name & Description -->
    <div class="w-full">
      <div class="flex items-center space-x-md">
        <Button
          link
          eager
          :icon="icon"
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
      <div class="flex flex-wrap items-center gap-2 mt-2">
        <Badge
          class="badge-secondary"
          icon="i-carbon:timer"
        />
        <Badge
          label="Draft"
          class="badge-primary badge-soft"
          icon="i-carbon:dot-mark"
        />
        <Badge
          label="Deployed"
          class="badge-success badge-soft"
          icon="i-carbon:dot-mark"
        />
        <Badge
          label="Running"
          class="badge-success"
          icon="i-carbon:dot-mark"
        />
        <Badge
          class="badge-danger"
          icon="i-carbon:error"
        />
      </div>

    </div>

    <!-- Right - Statistics -->
    <div class="flex items-center justify-center space-x-md shrink-0">
      <div class="flex divide-x divide-app grow lt-md:hidden">
        <ProjectListItemStatistic
          name="Executions"
          trend="up"
          value="100"
          unit="runs"
        />
      </div>

      <!-- CTA -->
      <ContextMenu x="right" y="top">
        <template #menu="{ close }">
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
    menu.edit: Edit
    menu.delete: Delete
    menu.duplicate: Duplicate
    menu.export: Export
    menu.publish: Publish
    menu.settings: Settings
  fr:
    menu.edit: Modifier
    menu.delete: Supprimer
    menu.duplicate: Dupliquer
    menu.export: Exporter
    menu.publish: Publier
    menu.settings: Paramètres
  de:
    menu.edit: Bearbeiten
    menu.delete: Löschen
    menu.duplicate: Duplizieren
    menu.export: Exportieren
    menu.publish: Veröffentlichen
    menu.settings: Einstellungen
  es:
    menu.edit: Editar
    menu.delete: Eliminar
    menu.duplicate: Duplicar
    menu.export: Exportar
    menu.publish: Publicar
    menu.settings: Ajustes
  zh:
    menu.edit: 编辑
    menu.delete: 删除
    menu.duplicate: 复制
    menu.export: 导出
    menu.publish: 发布
    menu.settings: 设置
</i18n>
