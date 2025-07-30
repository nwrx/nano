<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import type { ProjectObject } from '@nwrx/nano-api'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import Collapse from '~/components/base/Collapse.vue'
import FlowList from '~/components/flow/FlowList.vue'
import IconDynamic from '~/components/icon/IconDynamic.vue'
import UserAudit from '~/components/user/UserAudit.vue'
import ProjectActions from './ProjectActions.vue'

defineProps<{
  workspace: string
  project: ProjectObject
}>()

const isOpen = defineModel({ default: false })
</script>

<template>
  <div class="w-full h-full relative">
    <BaseButton
      eager
      class="
        flex items-center justify-start
        p-md gap-md rounded w-full
        bg-subtle hover:bg-emphasized
        cursor-pointer group
        b b-app hover:b-active
      "
      @click="() => { isOpen = !isOpen }">

      <!-- Dropdown toggle -->
      <BaseIcon
        icon="i-carbon:chevron-down"
        :class="{ 'rotate-180 !op-100': isOpen }"
        class="cursor-pointer shrink-0 size-8 op-0 group-hover:op-100 transition"
      />

      <!-- Icon -->
      <IconDynamic
        :name="project.icon"
        fallback="i-carbon:folder"
        :size="32"
        load
        class="size-8 shrink-0 text-app"
      />

      <!-- Title and description -->
      <div class="text-left grow">
        <h3 class="text-lg font-medium line-clamp-1">
          {{ project.title || project.name }}
        </h3>
        <p class="text-sm text-subtle line-clamp-1">
          {{ project.description }}
        </p>
      </div>

      <!-- Collaborators -->
      <!-- <ProjectListItemAssigments :assignments="assignments" /> -->

      <!-- User -->
      <UserAudit
        class="shrink-0"
        :created-at="project.createdAt"
        :created-by="project.createdBy"
        :updated-at="project.updatedAt"
        :updated-by="project.updatedBy"
      />

      <!-- Actions -->
      <ProjectActions
        class="shrink-0 op-0 group-hover:op-100 transition"
        :workspace="workspace"
        :project="project.name"
      />
    </BaseButton>

    <!-- Flow list -->
    <Collapse v-model="isOpen" class="b-l b-app ml-lg pl-lg">
      <FlowList
        :workspace="workspace"
        :project="project.name"
        class="pb-md pt-lg"
      />
    </Collapse>
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
