<script setup lang="ts">
import type { WorkspaceUserPermissions } from '@nwrx/nano-api'

const props = defineProps<{ name: string }>()

// --- Model.
const { t } = useI18n()
const alerts = useAlerts()
const client = useClient()
const assignments = ref<WorkspaceUserPermissions[]>([])

async function getAssignments() {
  await client.requestAttempt('GET /api/workspaces/:workspace/assignments', {
    data: {
      workspace: props.name,
    },
    onData: (data) => {
      assignments.value = data
    },
  })
}

onMounted(getAssignments)
</script>

<template>
  <AppPageForm vertical :title="t('title')" :text="t('description')">
    <Table :columns="['user', 'permissions', 'actions']" :rows="assignments!">

      <!-- Header -->
      <template #header="header">
        {{ t(`table.header.${header}`) }}
      </template>

      <!-- Cell / User -->
      <template #cell.user="{ username, displayName }">
        <UserCard
          class="!px-0"
          :display-name="displayName"
          :username="username"
        />
      </template>

      <!-- Cell / Permissions -->
      <template #cell.permissions="{ permissions }">
        <div class="flex items-center space-x-sm">
          <Badge
            v-for="permission in permissions"
            :key="permission"
            :label="t(`roles.${permission}.label`)"
          />
        </div>
      </template>

      <!-- Cell / Actions -->
      <template #cell.actions="assignment">
        <Trigger v-slot="dialogs" :keys="['edit', 'unassign']">
          <div class="flex items-center justify-end space-x-md">
            <ContextMenu x="right" y="top">
              <template #menu>
                <ContextMenuItem icon="i-carbon:edit" :label="t('actions.manage')" @click="() => dialogs.open('edit')" />
                <ContextMenuItem icon="i-carbon:delete" :label="t('actions.unassign')" @click="() => dialogs.open('unassign')" />
              </template>
            </ContextMenu>
          </div>

          <!-- Edit dialog -->
          <Ephemeral v-slot="{ value }" :initial-value="{ permissions: [...assignment.permissions] }">
            <Dialog
              v-model="dialogs.value.edit"
              icon="i-carbon:label"
              class-hint="hint-warning"
              class-button="button-warning"
              :title="t('dialog.edit.title', { name, username: assignment.username })"
              :text="t('dialog.edit.text', { name, username: assignment.username })"
              :label-cancel="t('dialog.edit.cancel')"
              :label-confirm="t('dialog.edit.confirm')"
              @confirm="() => {
                client.requestAttempt('PUT /api/workspaces/:workspace/assignments/:username', {
                  data: {
                    workspace: name,
                    username: assignment.username,
                    permissions: value.permissions,
                  },
                  onSuccess: () => {
                    getAssignments()
                    alerts.success(t('dialog.edit.success'))
                  },
                })
              }">
              <div class="space-y-4">
                <Checkbox
                  v-for="role in ['Admin', 'Member', 'Billing'] as const"
                  :key="role"
                  v-model="value.permissions"
                  :value="role"
                  type="checkbox"
                  :label="t(`roles.${role}.label`)"
                  :text="t(`roles.${role}.text`)"
                />
              </div>
            </Dialog>
          </Ephemeral>

          <!-- Unassign dialog -->
          <Dialog
            v-model="dialogs.value.unassign"
            icon="i-carbon:warning"
            class-hint="hint-danger"
            class-button="button-danger"
            :title="t('dialog.unassign.title', { name, username: assignment.username })"
            :text="t('dialog.unassign.text', { name, username: assignment.username })"
            :label-cancel="t('dialog.unassign.cancel')"
            :label-confirm="t('dialog.unassign.confirm')"
            @confirm="() => {
              client.requestAttempt('DELETE /api/workspaces/:workspace/assignments/:username', {
                data: {
                  workspace: name,
                  username: assignment.username,
                },
                onSuccess: () => {
                  getAssignments()
                  alerts.success(t('dialog.unassign.success'))
                },
              })
            }">
            <UserCard
              :display-name="assignment.displayName"
              :username="assignment.username"
            />
          </Dialog>
        </Trigger>
      </template>
    </Table>

    <Trigger v-slot="dialogs" :keys="['assign']">
      <Hyperlink
        eager
        class="text-sm"
        icon="i-carbon:add"
        :label="t('actions.addMember')"
        @click="() => dialogs.open('assign')"
      />

      <Ephemeral v-slot="model" :initial-value="[] as string[]">
        <Dialog
          v-model="dialogs.value.assign"
          icon="i-carbon:add"
          class-hint="hint-success"
          class-button="button-success"
          :title="t('dialog.assign.title', { name })"
          :text="t('dialog.assign.text', { name })"
          :label-cancel="t('dialog.assign.cancel')"
          :label-confirm="t('dialog.assign.confirm')"
          @confirm="() => {
            client.requestAttempt('POST /api/workspaces/:workspace/assignments', {
              data: {
                workspace: name,
                usernames: model.value,
              },
              onSuccess: () => {
                getAssignments()
                alerts.success(t('dialog.assign.success'))
              },
            })
          }">
          <UserSearch v-model="model.value" />
        </Dialog>
      </Ephemeral>
    </Trigger>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Access & Permissions
  description: Manage workspace members and their permissions. Control who can access and modify resources in this workspace.
  table:
    header:
      user: User
      permissions: Permissions
      actions: ''
  actions:
    addMember: Add a new member to the workspace
    manage: Manage permissions
    unassign: Remove from workspace
  dialog:
    assign:
      title: Add a new member to **{name}**
      text: Select a user to add to this workspace. The user will gain access according to the permissions you set.
      cancel: Cancel
      confirm: Add member
      success: Member successfully added to the workspace
    edit:
      title: Manage permissions for **{username}** in **{name}**
      text: Adjust permissions carefully. Admins have full control over the workspace.
      cancel: Cancel
      confirm: Update permissions
      success: Permissions successfully updated
    unassign:
      title: Remove **{username}** from **{name}**
      text: This user will lose all access to the workspace and its projects. This action cannot be undone.
      cancel: Cancel
      confirm: Remove user
      success: User successfully removed from the workspace
  roles:
    Admin:
      label: Admin
      text: Full control over the workspace, including managing members and settings.
    Member:
      label: Member
      text: Can create and access projects within the workspace.
    Owner:
      label: Owner
      text: Full control over the workspace, including managing members and settings.
fr:
  title: Accès et autorisations
  description: Gérez les membres de l'espace de travail et leurs autorisations. Contrôlez qui peut accéder et modifier les ressources dans cet espace de travail.
  table:
    header:
      user: Utilisateur
      permissions: Autorisations
      actions: ''
  actions:
    addMember: Ajouter un nouveau membre à l'espace de travail
    manage: Gérer les permissions
    unassign: Retirer de l'espace de travail
  dialog:
    assign:
      title: Ajouter un nouveau membre à **{name}**
      text: Sélectionnez un utilisateur à ajouter à cet espace de travail. L'utilisateur obtiendra l'accès selon les autorisations que vous définissez.
      cancel: Annuler
      confirm: Ajouter un membre
      success: Membre ajouté à l'espace de travail avec succès
    edit:
      title: Gérer les autorisations de **{username}** dans **{name}**
      text: Ajustez les autorisations avec précaution. Les administrateurs ont un contrôle total sur l'espace de travail.
      cancel: Annuler
      confirm: Mettre à jour les autorisations
      success: Autorisations mises à jour avec succès
    unassign:
      title: Retirer **{username}** de **{name}**
      text: Cet utilisateur perdra tout accès à l'espace de travail et à ses projets. Cette action ne peut pas être annulée.
      cancel: Annuler
      confirm: Retirer l'utilisateur
      success: Utilisateur retiré de l'espace de travail avec succès
  roles:
    Admin:
      label: Administrateur
      text: Contrôle complet de l'espace de travail, y compris la gestion des membres et des paramètres.
    Member:
      label: Membre
      text: Peut créer et accéder aux projets dans l'espace de travail.
    Owner:
      label: Propriétaire
      text: Contrôle complet de l'espace de travail, y compris la gestion des membres et des paramètres.
de:
  title: Zugriff und Berechtigungen
  description: Verwalten Sie Arbeitsbereichsmitglieder und deren Berechtigungen. Steuern Sie, wer auf Ressourcen in diesem Arbeitsbereich zugreifen und diese ändern kann.
  table:
    header:
      user: Benutzer
      permissions: Berechtigungen
      actions: ''
  actions:
    addMember: Neues Mitglied zum Arbeitsbereich hinzufügen
    manage: Berechtigungen verwalten
    unassign: Aus Arbeitsbereich entfernen
  dialog:
    assign:
      title: Neues Mitglied zu **{name}** hinzufügen
      text: Wählen Sie einen Benutzer aus, der diesem Arbeitsbereich hinzugefügt werden soll. Der Benutzer erhält Zugriff entsprechend den von Ihnen festgelegten Berechtigungen.
      cancel: Abbrechen
      confirm: Mitglied hinzufügen
      success: Mitglied erfolgreich zum Arbeitsbereich hinzugefügt
    edit:
      title: Berechtigungen für **{username}** in **{name}** verwalten
      text: Passen Sie die Berechtigungen sorgfältig an. Administratoren haben die volle Kontrolle über den Arbeitsbereich.
      cancel: Abbrechen
      confirm: Berechtigungen aktualisieren
      success: Berechtigungen erfolgreich aktualisiert
    unassign:
      title: '**{username}** aus **{name}** entfernen'
      text: Dieser Benutzer verliert den Zugriff auf den Arbeitsbereich und seine Projekte. Diese Aktion kann nicht rückgängig gemacht werden.
      cancel: Abbrechen
      confirm: Benutzer entfernen
      success: Benutzer erfolgreich aus dem Arbeitsbereich entfernt
  roles:
    Admin:
      label: Administrator
      text: Vollständige Kontrolle über den Arbeitsbereich, einschließlich der Verwaltung von Mitgliedern und Einstellungen.
    Member:
      label: Mitglied
      text: Kann Projekte im Arbeitsbereich erstellen und darauf zugreifen.
    Owner:
      label: Eigentümer
      text: Vollständige Kontrolle über den Arbeitsbereich, einschließlich der Verwaltung von Mitgliedern und Einstellungen.
es:
  table:
    header:
      user: Usuario
      permissions: Permisos
      actions: ''
  actions:
    addMember: Añadir un nuevo miembro al espacio de trabajo
    manage: Gestionar permisos
    unassign: Eliminar del espacio de trabajo
  dialog:
    assign:
      title: Añadir un nuevo miembro a **{name}**
      text: Seleccione un usuario para añadir a este espacio de trabajo. El usuario obtendrá acceso según los permisos que establezca.
      cancel: Cancelar
      confirm: Añadir miembro
      success: Miembro añadido al espacio de trabajo con éxito
    edit:
      title: Gestionar permisos para **{username}** en **{name}**
      text: Ajuste los permisos con cuidado. Los administradores tienen control total sobre el espacio de trabajo.
      cancel: Cancelar
      confirm: Actualizar permisos
      success: Permisos actualizados con éxito
    unassign:
      title: Eliminar a **{username}** de **{name}**
      text: Este usuario perderá todo el acceso al espacio de trabajo y sus proyectos. Esta acción no se puede deshacer.
      cancel: Cancelar
      confirm: Eliminar usuario
      success: Usuario eliminado del espacio de trabajo con éxito
  roles:
    Admin:
      label: Administrador
      text: Control total sobre el espacio de trabajo, incluida la gestión de miembros y configuración.
    Member:
      label: Miembro
      text: Puede crear y acceder a proyectos dentro del espacio de trabajo.
    Owner:
      label: Propietario
      text: Control total sobre el espacio de trabajo, incluida la gestión de miembros y configuración.
zh:
  title: 访问和权限
  description: 管理工作区成员及其权限。控制谁可以访问和修改此工作区中的资源。
  table:
    header:
      user: 用户
      permissions: 权限
      actions: ''
  actions:
    addMember: 向工作区添加新成员
    manage: 管理权限
    unassign: 从工作区移除
  dialog:
    assign:
      title: 向 **{name}** 添加新成员
      text: 选择要添加到此工作区的用户。该用户将根据您设置的权限获得访问权限。
      cancel: 取消
      confirm: 添加成员
      success: 成功将成员添加到工作区
    edit:
      title: 管理 **{name}** 中 **{username}** 的权限
      text: 谨慎调整权限。管理员对工作区拥有完全控制权。
      cancel: 取消
      confirm: 更新权限
      success: 权限更新成功
    unassign:
      title: 从 **{name}** 移除 **{username}**
      text: 该用户将失去对工作区及其项目的所有访问权限。此操作无法撤消。
      cancel: 取消
      confirm: 移除用户
      success: 成功从工作区移除用户
  roles:
    Admin:
      label: 管理员
      text: 对工作区的完全控制，包括管理成员和设置。
    Member:
      label: 成员
      text: 可以在工作区内创建和访问项目。
    Owner:
      label: 所有者
      text: 对工作区的完全控制，包括管理成员和设置。
</i18n>
