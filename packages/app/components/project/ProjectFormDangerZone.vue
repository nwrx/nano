<script setup lang="ts">
import AppPageFormAction from '~/components/app/AppPageForm.Action.vue'
import AppPageFormActions from '~/components/app/AppPageForm.Actions.vue'
import AppPageForm from '~/components/app/AppPageForm.vue'
import ProjectDialogDelete from './ProjectDialogDelete.vue'
import ProjectDialogRename from './ProjectDialogRename.vue'
import ProjectDialogTransfer from './ProjectDialogTransfer.vue'

defineProps<{
  workspace: string
  project: string
}>()

const { t } = useI18n()
const showRenameDialog = ref(false)
const showTransferDialog = ref(false)
const showDeleteDialog = ref(false)
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">
    <AppPageFormActions class="border-danger">
      <AppPageFormAction
        class="border-warning"
        class-button="button-warning"
        icon="i-carbon:edit"
        :title="t('renameTitle')"
        :text="t('renameText')"
        :label="t('renameLabel')"
        @click="() => showRenameDialog = true"
      />
      <AppPageFormAction
        class="border-danger"
        class-button="button-warning"
        icon="i-carbon:status-change"
        :title="t('transferTitle')"
        :text="t('transferText')"
        :label="t('transferLabel')"
        @click="() => showTransferDialog = true"
      />
      <AppPageFormAction
        class="border-danger"
        class-button="button-danger"
        icon="i-carbon:trash-can"
        :title="t('deleteTitle')"
        :text="t('deleteText')"
        :label="t('deleteLabel')"
        @click="() => showDeleteDialog = true"
      />
    </AppPageFormActions>
  </AppPageForm>

  <!-- Rename Dialog -->
  <ProjectDialogRename
    v-model="showRenameDialog"
    :workspace="workspace"
    :project="project"
  />

  <!-- Transfer Dialog -->
  <ProjectDialogTransfer
    v-model="showTransferDialog"
    :workspace="workspace"
    :project="project"
  />

  <!-- Delete Dialog -->
  <ProjectDialogDelete
    v-model="showDeleteDialog"
    :workspace="workspace"
    :project="project"
  />
</template>

<i18n lang="yaml">
en:
  title: Danger Zone
  text: Proceed with caution. Actions here can permanently affect your project and its integrations.
  renameTitle: Rename Project
  renameText: Renaming your project will update its URL and may break existing integrations or bookmarks. Please proceed with caution.
  renameLabel: Rename
  transferTitle: Transfer Ownership
  transferText: Transfer this project to another workspace or user. The new owner will have full control over this project.
  transferLabel: Transfer
  deleteTitle: Delete Project Permanently
  deleteText: This action is **irreversible**. All project data and configurations will be permanently lost.
  deleteLabel: Delete
fr:
  title: Zone Sensible
  text: Procédez avec prudence. Les actions ici peuvent affecter définitivement votre projet et ses intégrations.
  renameTitle: Renommer le Projet
  renameText: Renommer votre projet mettra à jour son URL et pourrait interrompre les intégrations ou favoris existants. Veuillez procéder avec prudence.
  renameLabel: Renommer
  transferTitle: Transférer la Propriété
  transferText: Transférer ce projet à un autre espace de travail ou utilisateur. Le nouveau propriétaire aura un contrôle total sur ce projet.
  transferLabel: Transférer
  deleteTitle: Supprimer le Projet Définitivement
  deleteText: Cette action est **irréversible**. Toutes les données et configurations du projet seront définitivement perdues.
  deleteLabel: Supprimer
de:
  title: Gefahrenzone
  text: Vorsicht geboten. Aktionen hier können Ihr Projekt und dessen Integrationen dauerhaft beeinflussen.
  renameTitle: Projekt Umbenennen
  renameText: Die Umbenennung Ihres Projekts ändert dessen URL und könnte bestehende Integrationen oder Lesezeichen unterbrechen. Bitte mit Vorsicht fortfahren.
  renameLabel: Umbenennen
  transferTitle: Eigentum Übertragen
  transferText: Übertragen Sie dieses Projekt an einen anderen Workspace oder Benutzer. Der neue Eigentümer erhält volle Kontrolle über dieses Projekt.
  transferLabel: Übertragen
  deleteTitle: Projekt Dauerhaft Löschen
  deleteText: Diese Aktion ist **unwiderruflich**. Alle Projektdaten und Konfigurationen gehen dauerhaft verloren.
  deleteLabel: Löschen
es:
  title: Zona de Peligro
  text: Proceda con precaución. Las acciones aquí pueden afectar permanentemente su proyecto y sus integraciones.
  renameTitle: Renombrar Proyecto
  renameText: Renombrar su proyecto actualizará su URL y podría interrumpir integraciones o marcadores existentes. Por favor, proceda con precaución.
  renameLabel: Renombrar
  transferTitle: Transferir Propiedad
  transferText: Transferir este proyecto a otro espacio de trabajo o usuario. El nuevo propietario tendrá control total sobre este proyecto.
  transferLabel: Transferir
  deleteTitle: Eliminar Proyecto Permanentemente
  deleteText: Esta acción es **irreversible**. Todos los datos y configuraciones del proyecto se perderán permanentemente.
  deleteLabel: Eliminar
zh:
  title: 危险区域
  text: 请谨慎操作。此处的操作可能会永久影响您的项目及其集成。
  renameTitle: 重命名项目
  renameText: 重命名项目将更新其URL并可能破坏现有集成或书签。请谨慎操作。
  renameLabel: 重命名
  transferTitle: 转移所有权
  transferText: 将此项目转移给另一个工作区或用户。新所有者将对此项目拥有完全控制权。
  transferLabel: 转移
  deleteTitle: 永久删除项目
  deleteText: 此操作**不可逆转**。所有项目数据和配置将永久丢失。
  deleteLabel: 删除
</i18n>
