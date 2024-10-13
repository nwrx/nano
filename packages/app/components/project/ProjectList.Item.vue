<script setup lang="ts">
import type { WorkspaceProjectObject } from '@nwrx/api'

const props = defineProps<{
  workspace: string
  modelValue?: boolean
} & WorkspaceProjectObject>()

const emit = defineEmits<{
  delete: []
  flowCreate: []
  flowDelete: [flowSlug: string]
  flowDownload: [flowSlug: string]
  flowDuplicate: [flowSlug: string]
  'update:modelValue': [value: boolean]
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, {
  passive: true,
})

function getProjectRoute(workspace: string, project: string) {
  if (!workspace || !project) return
  return {
    name: 'ProjectSettings',
    params: { workspace, project },
  }
}
</script>

<template>
  <div class="w-full">

    <!-- Header -->
    <BaseButton
      eager
      class="
        flex items-center justify-start
        p-md pr-xl gap-md rounded w-full
        border border-app bg-subtle
        cursor-pointer group
      "
      @click="() => { model = !model }">

      <!-- Dropdown toggle -->
      <BaseIcon
        icon="i-carbon:chevron-down"
        :class="{ 'rotate-180': model }"
        class="cursor-pointer size-8 opacity-40 group-hover:opacity-100 transition duration-slow"
      />

      <!-- Header -->
      <div class="text-left grow">
        <h3 class="text-lg font-medium">
          {{ title }}
        </h3>
        <p class="text-sm text-subtle line-clamp-2">
          {{ description }}
        </p>
      </div>

      <!-- Collaborators -->
      <ProjectListItemAssigments :assignments="assignments"/>

      <!-- CTA -->
      <ContextMenu x="right" y="top" @mousedown.stop>
        <template #menu="{ close }">
          <ContextMenuItem
            :label="t('menu.settings')"
            icon="i-carbon:settings"
            keybind="Ctrl + Shift + S"
            :to="getProjectRoute(workspace, name)"
            @click="() => close()"
          />
          <ContextMenuItem
            :label="t('menu.access')"
            icon="i-carbon:group"
            keybind="Ctrl + Shift + C"
            :to="getProjectRoute(workspace, name)"
            @click="() => close()"
          />
          <ContextMenuDivider />
          <ContextMenuItem
            :label="t('menu.delete')"
            icon="i-carbon:delete"
            keybind="Backspace"
            @click="() => { emit('delete'); close() }"
          />
        </template>
      </ContextMenu>
    </BaseButton>

    <!-- Blocks that lists the flows -->
    <BaseCollapse
      vertical
      :isOpen="model"
      :class="{ 'opacity-0': !model }"
      class="border-l border-app ml-lg pl-lg transition-all duration-slow">

      <div class="flex flex-col space-y-xs pt-md mb-md">
        <ProjectListItemFlow
          v-for="flow in flows"
          :key="flow.name"
          :project="name"
          :workspace="workspace"
          v-bind="flow"
          icon="i-carbon:flow"
          isRunning
          isDeployed
          class="shrink-0"
          @delete="() => emit('flowDelete', flow.name)"
          @download="() => emit('flowDownload', flow.name)"
          @duplicate="() => emit('flowDuplicate', flow.name)"
        />
      </div>

      <!-- Create flow button -->
      <Button
        link
        :label="t('createFlow')"
        class="mb-sm text-subtle"
        icon-prepend="i-carbon:flow"
        icon-append="i-carbon:chevron-right"
        icon-expand
        size="sm"
        @click="() => emit('flowCreate')"
      />
    </BaseCollapse>
  </div>
</template>

<i18n lang="yaml">
  en:
    menu.settings: Edit
    menu.access: Access
    menu.delete: Delete
    createFlow: Create a new Flow in this Project
  fr:
    menu.settings: Modifier
    menu.access: Accès
    menu.delete: Supprimer
    createFlow: Créer un nouveau Flow dans ce projet
  de:
    menu.settings: Bearbeiten
    menu.access: Zugriff
    menu.delete: Löschen
    createFlow: Erstellen Sie einen neuen Flow in diesem Projekt
  es:
    menu.settings: Editar
    menu.access: Acceso
    menu.delete: Borrar
    createFlow: Crear un nuevo flujo en este proyecto
  zh:
    menu.settings: 编辑
    menu.access: 访问
    menu.delete: 删除
    createFlow: 在此项目中创建新流程
</i18n>
