<!-- eslint-disable unicorn/prefer-ternary -->
<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import type { application, FlowObject, ProjectObject } from '@nwrx/nano-api'
import type { ChannelConnectOptions } from '@unserved/client'
import type { WebSocketChannel } from '@unshared/client/websocket'
type UseProjectChannel = WebSocketChannel<ChannelConnectOptions<typeof application, 'WS /ws/workspaces/:workspace/projects/:project'>>

const props = defineProps<ProjectObject & {
  workspace: string
}>()

const emit = defineEmits<{
  delete: []
  flowCreate: []
  flowDelete: [flow: string]
  flowDownload: [flow: string]
  flowDuplicate: [flow: string]
  flowImport: [file: File]
}>()

const { t } = useI18n()
const routes = useRouteLocation()
const client = useClient()
const alerts = useAlerts()
const flows = ref<FlowObject[]>([])

let channel: undefined | UseProjectChannel
tryOnScopeDispose(() => {
  if (!channel) return
  void channel.close()
})

async function subscribe() {
  if (channel) return
  channel = await client.connect('WS /ws/workspaces/:workspace/projects/:project', {
    data: {
      workspace: props.workspace,
      project: props.name,
    },
    onMessage: (message) => {
      if (message.event === 'flows') flows.value = message.flows
      if (message.event === 'flowCreated') flows.value = [...flows.value, message.flow]
      if (message.event === 'flowDeleted') flows.value = flows.value.filter(flow => flow.name !== message.name)
    },
  }).open()
}

async function unsubscribe() {
  if (!channel) return
  await channel.close()
  channel = undefined
}

const isOpen = defineModel({ default: false })
watch(isOpen, value => (value ? subscribe() : unsubscribe()), { immediate: true })

// --- Dropzone for importing flows.
const dropzone = ref<HTMLDivElement>()
const { isOverDropZone } = useDropZone(dropzone, {
  onDrop: (files) => {
    if (!files) return
    if (files.length === 0) return
    emit('flowImport', files[0])
  },
})

async function createFlow() {
  await client.requestAttempt('POST /api/workspaces/:workspace/projects/:project/flows', {
    data: {
      workspace: props.workspace,
      project: props.name,
    },
    onSuccess: () => {
      alerts.success(t('flowCreated'))
    },
  })
}

async function deleteFlow(flow: string) {
  await client.requestAttempt('DELETE /api/workspaces/:workspace/projects/:project/flows/:flow', {
    data: {
      workspace: props.workspace,
      project: props.name,
      flow,
    },
    onSuccess: () => {
      alerts.success(t('flowDeleted'))
    },
  })
}
</script>

<template>
  <div ref="dropzone" class="w-full h-full relative">

    <!-- Dropzone -->
    <Dropzone
      :is-over="isOverDropZone"
      :text="t('dropZone', { title })"
      :vertical="isOpen"
    />

    <!-- Header -->
    <BaseButton
      eager
      class="
        flex items-center justify-start
        p-md pr-xl gap-md rounded w-full
        border border-app bg-subtle
        cursor-pointer group
      "
      @click="() => { isOpen = !isOpen }">

      <!-- Dropdown toggle -->
      <BaseIcon
        icon="i-carbon:chevron-down"
        :class="{ 'rotate-180': isOpen }"
        class="cursor-pointer shrink-0 size-8 opacity-40 group-hover:opacity-100 transition duration-slow"
      />

      <!-- Header -->
      <div class="text-left grow">
        <h3 class="text-lg font-medium" v-text="title" />
        <p class="text-sm text-subtle line-clamp-2" v-text="description" />
      </div>

      <!-- Collaborators -->
      <!-- <ProjectListItemAssigments :assignments="assignments" /> -->

      <!-- CTA -->
      <ContextMenu x="right" y="top" @mousedown.stop>
        <template #menu="{ close }">
          <ContextMenuItem
            :label="t('menu.settings')"
            icon="i-carbon:settings"
            keybind="Ctrl + Shift + S"
            :to="routes.getProjectSettingsRoute(workspace, name)"
            @click="() => close()"
          />
          <ContextMenuItem
            :label="t('menu.access')"
            icon="i-carbon:group"
            keybind="Ctrl + Shift + C"
            :to="routes.getProjectSettingsRoute(workspace, name)"
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

    <!-- Flow list -->
    <BaseCollapse
      vertical
      :is-open="isOpen"
      :duration="300"
      :class="{ 'op-0': isOpen !== true }"
      class="b-l b-app ml-lg pl-lg transition-all duration-slow">
      <div class="space-y-md py-md">
        <ProjectListItemFlow
          v-for="flow in flows"
          :key="flow.name"
          v-bind="flow"
          :workspace="workspace"
          :project="name"
          icon="i-carbon:flow"
          class="shrink-0"
        />

        <!-- Create flow button -->
        <Hyperlink
          :label="t('createFlow')"
          class="text-sm my-md"
          icon-prepend="i-carbon:flow"
          icon-append="i-carbon:chevron-right"
          icon-expand
          @click="() => createFlow()"
        />
      </div>
    </BaseCollapse>
  </div>
</template>

<i18n lang="yaml">
en:
  menu.settings: Edit
  menu.access: Access
  menu.delete: Delete
  createFlow: Create a new Flow in this Project
  dropZone: Import a flow in the **{title}** project.
fr:
  menu.settings: Modifier
  menu.access: Accès
  menu.delete: Supprimer
  createFlow: Créer un nouveau flux dans ce projet
  dropZone: Importer un flux dans le projet **{title}**.
de:
  menu.settings: Bearbeiten
  menu.access: Zugriff
  menu.delete: Löschen
  createFlow: Erstellen Sie einen neuen Flow in diesem Projekt
  dropZone: Importieren Sie einen Flow in das Projekt **{title}**.
es:
  menu.settings: Editar
  menu.access: Acceso
  menu.delete: Borrar
  createFlow: Crear un nuevo flujo en este proyecto
  dropZone: Importar un flujo en el proyecto **{title}**.
zh:
  menu.settings: 编辑
  menu.access: 访问
  menu.delete: 删除
  createFlow: 在此项目中创建新流程
  dropZone: 在 **{title}** 项目中导入流程。
</i18n>
