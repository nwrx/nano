<script setup lang="ts">
import type { ProjectPermission, ProjectUserPermissionsObject, UserObject } from '@nwrx/nano-api'
import ProjectSettingsAssignmentsPermissions from './ProjectSettings.AssignmentsPermissions.vue'

const props = defineProps<{
  workspace?: string
  project?: string
  title?: string
  assignments?: ProjectUserPermissionsObject[]
  searchUsers?: (search: string) => Promise<UserObject[]>
}>()

const emit = defineEmits<{
  submitAssign: [username: string]
  submitUnassign: [username: string]
  submitSetPermissions: [username: string, permissions: ProjectPermission[]]
}>()

const { t } = useI18n()
const assignments = useVModel(props, 'assignments', emit, { passive: true })
const isAssignDialogOpen = ref(false)
</script>

<template>
  <AppPageForm :title="t('title')">

    <!-- Text -->
    <template #text>
      <I18nT keypath="text">
        <template #newline>
          <br><br>
        </template>
        <template #documentation>
          <Hyperlink :label="t('text.documentation')" :to="CONSTANTS.appCanonicalUrl" />
        </template>
      </I18nT>
    </template>

    <!-- List of assignments -->
    <div class="rounded w-full b b-app">
      <BaseTable
        :columns="['user', 'permissions', 'actions']"
        :rows="assignments!"
        class="w-full"
        class-cell="px-8 py-2"
        class-header="bg-subtle"
        class-row="b-t b-app hover:bg-subtle">

        <!-- Header -->
        <template #header="name">
          <div class="w-full font-medium px-lg py-sm text-sm text-start">
            {{ t(`header.${name}`) }}
          </div>
        </template>

        <!-- Cell / User -->
        <template #cell.user="{ user }">
          <UserCard
            :avatar-url="user.avatarUrl"
            :display-name="user.displayName"
            :username="user.username"
          />
        </template>

        <template #cell.permissions="{ permissions }">
          <ProjectSettingsAssignmentsPermissions :permissions="permissions" />
        </template>

        <template #cell.actions="{ user, permissions }">
          <ProjectSettingsAssignmentActions
            :workspace="workspace"
            :project="project"
            :title="title"
            :username="user.username"
            :user-display-name="user.displayName"
            :permissions="permissions"
            @submit-unassign="() => emit('submitUnassign', user.username)"
            @submit-set-permissions="(permissions) => emit('submitSetPermissions', user.username, permissions)"
          />
        </template>
      </BaseTable>
    </div>

    <div class="flex items-center justify-between p-4">
      <Hyperlink
        eager
        class="text-sm"
        icon="i-carbon:add"
        :label="t('button.addMember')"
        @click="() => isAssignDialogOpen = true"
      />
    </div>

    <!-- Assign dialog -->
    <ProjectSettingsAssignmentDialogAssign
      v-model="isAssignDialogOpen"
      :workspace="workspace"
      :project="project"
      :title="title"
      :search-users="searchUsers"
      @submit="(username) => emit('submitAssign', username)"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Members
  text: Define who can access and manage the project. You can add or remove team members, and assign them different permissions. For more information, please refer to the {documentation}.
  text.documentation: documentation
  button.addMember: Add a team member
  header.user: User
  header.permissions: Permissions
  header.actions: ''
fr:
  title: Membres
  text: Définissez qui peut accéder et gérer le projet. Vous pouvez ajouter ou supprimer des membres de l'équipe et leur attribuer différentes autorisations. Pour plus d'informations, veuillez vous référer à la {documentation}.
  text.documentation: documentation
  button.addMember: Ajouter un membre à l'équipe
  header.user: Utilisateur
  header.permissions: Permissions
  header.actions: ''
de:
  title: Mitglieder
  text: Legen Sie fest, wer auf das Projekt zugreifen und es verwalten kann. Sie können Teammitglieder hinzufügen oder entfernen und ihnen verschiedene Berechtigungen zuweisen. Weitere Informationen finden Sie in der {documentation}.
  text.documentation: documentation
  button.addMember: Teammitglied hinzufügen
  header.user: Benutzer
  header.permissions: Berechtigungen
  header.actions: ''
es:
  title: Miembros
  text: Define quién puede acceder y administrar el proyecto. Puede agregar o eliminar miembros del equipo y asignarles diferentes permisos. Para obtener más información, consulte la {documentation}.
  text.documentation: documentación
  button.addMember: Agregar un miembro del equipo
  header.user: Usuario
  header.permissions: Permisos
  header.actions: ''
zh:
  title: 成员
  text: 定义谁可以访问和管理项目。您可以添加或删除团队成员，并为他们分配不同的权限。有关更多信息，请参阅 {documentation}。
  text.documentation: 文档
  button.addMember: 添加团队成员
  header.user: 用户
  header.permissions: 权限
  header.actions: ''
</i18n>
