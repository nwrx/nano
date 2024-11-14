<script setup lang="ts">
defineProps<{
  workspace: string
  project: string
  name: string
}>()

const emit = defineEmits<{
  submitUpdate: [value: string]
  submitDelete: []
  submitCreate: [name: string, value: string]
}>()

const { t } = useI18n()
const isDialogUpdateOpen = ref(false)
const isDialogDeleteOpen = ref(false)
const isDialogCreateOpen = ref(false)
</script>

<template>
  <div class="flex items-center justify-end space-x-md">
    <ContextMenu x="right" y="top">
      <template #menu>
        <ContextMenuItem
          icon="i-carbon:rule-locked"
          :label="t('create')"
          keybind="Ctrl + N"
          @click="() => isDialogCreateOpen = true"
        />
        <ContextMenuItem
          icon="i-carbon:edit"
          :label="t('update')"
          keybind="Ctrl + E"
          @click="() => isDialogUpdateOpen = true"
        />
        <ContextMenuItem
          icon="i-carbon:trash-can"
          :label="t('delete')"
          keybind="Ctrl + E"
          @click="() => isDialogDeleteOpen = true"
        />
      </template>
    </ContextMenu>

    <!-- Create Dialog -->
    <ProjectSettingsSecretsDialogCreate
      v-model="isDialogCreateOpen"
      :workspace="workspace"
      :project="project"
      @submit="(name, value) => emit('submitCreate', name, value)"
    />

    <!-- Update Dialog -->
    <ProjectSettingsSecretsDialogUpdate
      v-model="isDialogUpdateOpen"
      :workspace="workspace"
      :project="project"
      :name="name"
      @submit="value => emit('submitUpdate', value)"
    />

    <!-- Delete Dialog -->
    <ProjectSettingsSecretsDialogDelete
      v-model="isDialogDeleteOpen"
      :workspace="workspace"
      :project="project"
      :name="name"
      @submit="() => emit('submitDelete')"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  create: Create
  update: Update
  delete: Delete
fr:
  create: Créer
  update: Modifier
  delete: Supprimer
de:
  create: Erstellen
  update: Aktualisieren
  delete: Löschen
es:
  create: Crear
  update: Actualizar
  delete: Borrar
zh:
  create: 创建
  update: 更新
  delete: 删除
</i18n>
