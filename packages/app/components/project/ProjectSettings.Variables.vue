<script setup lang="ts">
import type { WorkspaceProjectVariableObject } from '@nwrx/nano-api'

const props = defineProps<{
  workspace: string
  project: string
  variables?: WorkspaceProjectVariableObject[]
}>()

const emit = defineEmits<{
  'submitCreate': [name: string, value: string]
  'submitUpdate': [name: string, value: string]
  'submitDelete': [name: string]
}>()

const { t } = useI18n()
const variables = useVModel(props, 'variables', emit, { passive: true })
const isDialogCreateOpen = ref(false)
</script>

<template>
  <AppPageForm
    vertical
    :title="t('title')"
    :text="t('text')">

    <!-- Variables List -->
    <div class="w-full b b-app rd">
      <BaseTable
        :columns="['name', 'stats', 'actions']"
        class="w-full"
        class-cell="px-8 py-2"
        class-header="bg-subtle"
        class-row="b-t b-app hover:bg-subtle"
        :rows="variables">

        <!-- Header -->
        <template #header="name">
          <div class="w-full font-medium px-lg py-sm text-sm text-start">
            {{ t(`header.${name}`) }}
          </div>
        </template>

        <!-- Cell / Name -->
        <template #cell.name="{ name }">
          <div class="flex items-center justify-start space-x-md font-normal">
            <Badge
              size="small"
              :label="name"
              icon="i-carbon:tag"
              class="font-mono"
            />
          </div>
        </template>

        <!-- Cell / Stats -->
        <template #cell.stats="{ createdAt }">
          <div class="text-xs text-subtle">
            {{ t('createdAt') }} {{ formatDate(createdAt) }}
          </div>
          <div class="text-sm">
            {{ formatDateFromNow(createdAt) }}
          </div>
        </template>

        <!-- Cell / Actions -->
        <template #cell.actions="{ name, value }">
          <ProjectSettingsVariablesActions
            :workspace="workspace"
            :project="project"
            :value="value"
            :name="name"
            @submit-update="(value) => emit('submitUpdate', name, value)"
            @submit-delete="() => emit('submitDelete', name)"
          />
        </template>
      </BaseTable>
    </div>

    <!-- Create Button -->
    <Hyperlink
      eager
      class="text-sm ml-auto mb-4"
      icon="i-carbon:add"
      icon-append="i-carbon:chevron-right"
      :label="t('create')"
      @click="() => isDialogCreateOpen = true"
    />

    <!-- Create Dialog -->
    <ProjectSettingsVariablesDialogCreate
      v-model="isDialogCreateOpen"
      :workspace="workspace"
      :project="project"
      @submit="(name, value) => emit('submitCreate', name, value)"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  header.name: Variable name
  header.stats: ''
  header.actions: ''
  title: Variables
  text: Variables are key-value pairs that can be used in your flows. They can be used to store values that are shared across multiple flows. You can create, update, and delete variables here.
  createdAt: Created on {createdAt}
  create: Create Variable
fr:
  header.name: Nom de la variable
  header.stats: ''
  header.actions: ''
  title: Variables
  text: Les variables sont des paires clé-valeur qui peuvent être utilisées dans vos flux. Elles peuvent être utilisées pour stocker des valeurs partagées entre plusieurs flux. Vous pouvez créer, mettre à jour et supprimer des variables ici.
  createdAt: Créé le {createdAt}
  create: Créer une variable
de:
  header.name: Variablenname
  header.stats: ''
  header.actions: ''
  title: Variablen
  text: Variablen sind Schlüssel-Wert-Paare, die in Ihren Flows verwendet werden können. Sie können verwendet werden, um Werte zu speichern, die in mehreren Flows gemeinsam genutzt werden. Sie können hier Variablen erstellen, aktualisieren und löschen.
  createdAt: Erstellt am {createdAt}
  create: Variable erstellen
es:
  header.name: Nombre de la variable
  header.stats: ''
  header.actions: ''
  title: Variables
  text: Las variables son pares clave-valor que se pueden utilizar en sus flujos. Se pueden utilizar para almacenar valores que se comparten entre varios flujos. Puede crear, actualizar y eliminar variables aquí.
  createdAt: Creado el {createdAt}
  create: Crear variable
zh:
  header.name: 变量名
  header.stats: ''
  header.actions: ''
  title: 变量
  text: 变量是可以在您的流程中使用的键值对。它们可用于存储在多个流程之间共享的值。您可以在此处创建、更新和删除变量。
  createdAt: 创建于 {createdAt}
  create: 创建变量
</i18n>
