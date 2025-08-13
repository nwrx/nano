<script setup lang="ts">
import type { WorkspacePermission } from '@nwrx/nano-api'

const props = defineProps<{
  modelValue?: boolean
  workspace: string
  username: string
  initialValue: WorkspacePermission[]
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const permissions = ref<WorkspacePermission[]>([])
async function updateUserAssignments() {
  await client.requestAttempt('PUT /workspaces/:workspace/assignments/:username', {
    data: {
      workspace: props.workspace,
      username: props.username,
      permissions: permissions.value,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success'))
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => permissions.value = props.initialValue, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:label"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { workspace, username })"
    :text="t('text', { workspace, username })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => updateUserAssignments()">
    <div class="space-y-4">
      <Checkbox
        v-for="role in ['Admin', 'Member', 'Owner']"
        :key="role"
        v-model="permissions"
        :value="role"
        type="checkbox"
        :label="t(`roles.${role}.label`)"
        :text="t(`roles.${role}.text`)"
      />
    </div>
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: 'Edit assignments for {workspace}'
  text: 'Select the roles you want to assign to {username} in the workspace.'
  cancel: Cancel
  confirm: Save
  success: Assignments saved successfully.
  roles:
    Admin:
      label: Admin
      text: Can manage workspace settings and assignments.
    Member:
      label: Member
      text: Can view and edit workspace content.
    Owner:
      label: Owner
      text: 'Can manage workspace settings, assignments, and delete the workspace.'
fr:
  title: 'Modifier les affectations pour {workspace}'
  text: Sélectionnez les rôles que vous souhaitez attribuer à {username} dans l'espace de travail.
  cancel: Annuler
  confirm: Enregistrer
  success: Affectations enregistrées avec succès.
  roles:
    Admin:
      label: Admin
      text: Peut gérer les paramètres et les affectations de l'espace de travail.
    Member:
      label: Membre
      text: Peut afficher et modifier le contenu de l'espace de travail.
    Owner:
      label: Propriétaire
      text: Peut gérer les paramètres de l\'espace de travail, les affectations et supprimer l\'espace de travail.
de:
  title: 'Zuweisungen für {workspace} bearbeiten'
  text: 'Wählen Sie die Rollen aus, die Sie {username} im Arbeitsbereich zuweisen möchten.'
  cancel: Abbrechen
  confirm: Speichern
  success: Zuweisungen erfolgreich gespeichert.
  roles:
    Admin:
      label: Admin
      text: Kann Arbeitsbereichseinstellungen und Zuweisungen verwalten.
    Member:
      label: Mitglied
      text: Kann Arbeitsbereichsinhalte anzeigen und bearbeiten.
    Owner:
      label: Besitzer
      text: 'Kann Arbeitsbereichseinstellungen, Zuweisungen verwalten und den Arbeitsbereich löschen.'
es:
  title: 'Editar asignaciones para {workspace}'
  text: 'Seleccione los roles que desea asignar a {username} en el espacio de trabajo.'
  cancel: Cancelar
  confirm: Guardar
  success: Asignaciones guardadas con éxito.
  roles:
    Admin:
      label: Admin
      text: Puede administrar la configuración y las asignaciones del espacio de trabajo.
    Member:
      label: Miembro
      text: Puede ver y editar el contenido del espacio de trabajo.
    Owner:
      label: Propietario
      text: 'Puede administrar la configuración del espacio de trabajo, las asignaciones y eliminar el espacio de trabajo.'
zh:
  title: '编辑 {workspace} 的分配'
  text: '选择要在工作区中分配给 {username} 的角色。'
  cancel: 取消
  confirm: 保存
  success: 分配已成功保存。
  roles:
    Admin:
      label: 管理员
      text: 可以管理工作区设置和分配。
    Member:
      label: 成员
      text: 可以查看和编辑工作区内容。
    Owner:
      label: 所有者
      text: 可以管理工作区设置、分配和删除工作区。
</i18n>
