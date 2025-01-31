<script setup lang="ts">
import type { UserObject } from '@nwrx/api'

defineProps<{
  searchUsers: (search: string) => Promise<UserObject[]>
  workspace: string
  project: string
  title: string
}>()

const emit = defineEmits<{
  submitName: [value: string]
  submitDelete: []
  submitTransfer: [value: string]
}>()

const { t } = useI18n({ useScope: 'local' })
const isDialogDeleteOpen = ref(false)
const isDialogRenameOpen = ref(false)
const isDialogTransferOpen = ref(false)
</script>

<template>
  <AppPageForm :title="t('title')">

    <!-- Text -->
    <template #text>
      <I18nT keypath="text">
        <template #newline><br><br></template>
        <template #guide>
          <Button link variant="primary" :label="t('text.guide')" :href="CONSTANTS.appCanonicalUrl" />
        </template>
      </I18nT>
    </template>

    <!-- Actions -->
    <AppPageFormActions class="border-danger">
      <AppPageFormAction
        class="border-danger"
        icon="i-carbon:edit"
        :title="t('action.rename.title')"
        :text="t('action.rename.text')"
        :label="t('action.rename.label')"
        @click="() => isDialogRenameOpen = true"
      />
      <AppPageFormAction
        class="border-danger"
        icon="i-carbon:status-change"
        :title="t('action.transfer.title')"
        :text="t('action.transfer.text')"
        :label="t('action.transfer.label')"
        @click="() => isDialogTransferOpen = true"
      />
      <AppPageFormAction
        class="border-danger"
        icon="i-carbon:trash-can"
        :title="t('action.delete.title')"
        :text="t('action.delete.text')"
        :label="t('action.delete.label')"
        @click="() => isDialogDeleteOpen = true"
      />
    </AppPageFormActions>

    <!-- Delete project dialog -->
    <ProjectSettingsDangerZoneDialogDelete
      v-model="isDialogDeleteOpen"
      :workspace="workspace"
      :project="project"
      :title="title"
      @submit="() => emit('submitDelete')"
    />

    <!-- Rename project dialog -->
    <ProjectSettingsDangerZoneDialogRename
      v-model="isDialogRenameOpen"
      :workspace="workspace"
      :project="project"
      :title="title"
      @submit="(name) => emit('submitName', name)"
    />

    <!-- Transfer project dialog -->
    <ProjectSettingsDangerZoneDialogTransfer
      v-model="isDialogTransferOpen"
      :workspace="workspace"
      :project="project"
      :title="title"
      :searchUsers="searchUsers"
      @submit="(owner) => emit('submitTransfer', owner)"
    />

  </AppPageForm>
</template>

<i18n lang="yaml">
  en:
    title: Danger Zone
    text: Be cautious when making changes in this section. You can delete your project or change the URL which might break existing integrations and cause issues with the services that depend on it.{newline}For ways to mitigate these issues, please refer to the {guide} for more information and best-practices.
    text.guide: guide
    action.rename.title: Rename Project
    action.rename.text: Changing the project URL might break existing integrations.
    action.rename.label: Rename
    action.transfer.title: Transfer Ownership
    action.transfer.text: Changing the owner and might break existing integrations.
    action.transfer.label: Transfer
    action.delete.title: Delete Project
    action.delete.text: This action is irreversible and will permanently delete your project.
    action.delete.label: Delete
  fr:
    title: Zone de danger
    text: Soyez prudent lorsque vous apportez des modifications dans cette section. Vous pouvez supprimer votre projet ou modifier l'URL, ce qui pourrait rompre les intégrations existantes et causer des problèmes avec les services qui en dépendent.{newline}Pour des moyens d'atténuer ces problèmes, veuillez vous référer au {guide} pour plus d'informations et de bonnes pratiques.
    text.guide: guide
    action.rename.title: Renommer le projet
    action.rename.text: Changer l'URL du projet pourrait rompre les intégrations existantes.
    action.rename.label: Renommer
    action.transfer.title: Transférer la propriété
    action.transfer.text: Changer le propriétaire et pourrait rompre les intégrations existantes.
    action.transfer.label: Transférer
    action.delete.title: Supprimer le projet
    action.delete.text: Cette action est irréversible et supprimera définitivement votre projet.
    action.delete.label: Supprimer
  de:
    title: Gefahrenzone
    text: Seien Sie vorsichtig, wenn Sie Änderungen in diesem Abschnitt vornehmen. Sie können Ihr Projekt löschen oder die URL ändern, was bestehende Integrationen unterbrechen und Probleme mit den Diensten verursachen kann, die davon abhängen.{newline}Für Möglichkeiten, diese Probleme zu mildern, verweisen Sie bitte auf den {guide} für weitere Informationen und bewährte Verfahren.
    text.guide: leitfaden
    action.rename.title: Projekt umbenennen
    action.rename.text: Das Ändern der Projekt-URL könnte bestehende Integrationen unterbrechen.
    action.rename.label: Umbenennen
    action.transfer.title: Eigentum übertragen
    action.transfer.text: Ändern des Eigentümers und könnte bestehende Integrationen unterbrechen.
    action.transfer.label: Übertragen
    action.delete.title: Projekt löschen
    action.delete.text: Diese Aktion ist nicht rückgängig zu machen und löscht Ihr Projekt dauerhaft.
    action.delete.label: Löschen
  es:
    title: Zona de peligro
    text: Tenga cuidado al realizar cambios en esta sección. Puede eliminar su proyecto o cambiar la URL, lo que podría romper las integraciones existentes y causar problemas con los servicios que dependen de él.{newline}Para formas de mitigar estos problemas, consulte la {guide} para obtener más información y mejores prácticas.
    text.guide: guía
    action.rename.title: Renombrar proyecto
    action.rename.text: Cambiar la URL del proyecto podría romper las integraciones existentes.
    action.rename.label: Renombrar
    action.transfer.title: Transferir propiedad
    action.transfer.text: Cambiar el propietario y podría romper las integraciones existentes.
    action.transfer.label: Transferir
    action.delete.title: Eliminar proyecto
    action.delete.text: Esta acción es irreversible y eliminará permanentemente su proyecto.
    action.delete.label: Eliminar
  zh:
    title: 危险区
    text: 在此部分进行更改时要小心。您可以删除项目或更改 URL，这可能会破坏现有集成并导致依赖于它的服务出现问题。{newline}有关缓解这些问题的方法，请参阅 {guide} 以获取更多信息和最佳实践。
    text.guide: 指南
    action.rename.title: 重命名项目
    action.rename.text: 更改项目 URL 可能会破坏现有集成。
    action.rename.label: 重命名
    action.transfer.title: 转移所有权
    action.transfer.text: 更改所有者并可能会破坏现有集成。
    action.transfer.label: 转移
    action.delete.title: 删除项目
    action.delete.text: 此操作是不可逆的，将永久删除您的项目。
    action.delete.label: 删除
</i18n>
