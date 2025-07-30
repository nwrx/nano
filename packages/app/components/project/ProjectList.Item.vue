<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import type { ProjectObject } from '@nwrx/nano-api'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import ProjectActions from './ProjectActions.vue'

const props = defineProps<{
  workspace: string
  project: ProjectObject
}>()

const isOpen = defineModel({ default: false })

// --- Dropzone for importing flows.
// const dropzone = ref<HTMLDivElement>()
// const { isOverDropZone } = useDropZone(dropzone, {
//   onDrop: (files) => {
//     if (!files) return
//     if (files.length === 0) return
//   },
// })
</script>

<template>
  <div ref="dropzone" class="w-full h-full relative">

    <!-- Dropzone -->
    <!--
      <Dropzone
      :is-over="isOverDropZone"
      :text="t('dropZone', { title })"
      :vertical="isOpen"
      />
    -->

    <!-- Header -->
    <BaseButton
      eager
      class="
        flex items-center justify-start
        p-md pr-xl gap-md rounded w-full
        bg-subtle
        cursor-pointer group
        b b-app hover:b-active
      "
      @click="() => { isOpen = !isOpen }">

      <!-- Dropdown toggle -->
      <BaseIcon
        icon="i-carbon:chevron-down"
        :class="{ 'rotate-180': isOpen }"
        class="cursor-pointer shrink-0 size-8 opacity-40 group-hover:opacity-100 transition duration-slow"
      />

      <!-- Title and description -->
      <div class="text-left grow">
        <h3 class="text-lg font-medium">
          {{ project.title || project.name }}
        </h3>
        <p class="text-sm text-subtle line-clamp-2">
          {{ project.description }}
        </p>
      </div>

      <!-- Collaborators -->
      <!-- <ProjectListItemAssigments :assignments="assignments" /> -->

      <!-- CTA -->
      <ProjectActions
        :workspace="workspace"
        :project="project.name"
      />
    </BaseButton>

    <!-- Flow list -->
    <!--
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
    -->
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
