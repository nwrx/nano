<script setup lang="ts">
import type { ProjectPermission, ProjectUserPermissions } from '@nwrx/nano-api'

defineProps<{
  workspace: string
  project: string
  assignments: ProjectUserPermissions[]
}>()

const emit = defineEmits<{
  submitAssign: [string]
  submitUnassign: [string]
  submitPermissions: [string, ProjectPermission[]]
}>()

const { t } = useI18n()
const isAssignDialogOpen = ref(false)
</script>

<template>
  <AppPageForm vertical :title="t('title')">

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
        <template #cell.user="{ username, displayName }">
          <UserCard :display-name="displayName" :username="username" />
        </template>

        <template #cell.permissions="{ permissions }">
          <ProjectSettingsAssignmentsPermissions :permissions="permissions" />
        </template>

        <template #cell.actions="{ username, displayName, permissions }">
          <ProjectSettingsAssignmentsActions
            :workspace="workspace"
            :project="project"
            :username="username"
            :display-name="displayName"
            :permissions="permissions"
            @submit-unassign="() => emit('submitUnassign', username)"
            @submit-permissions="(permissions) => emit('submitPermissions', username, permissions)"
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
    <ProjectSettingsAssignmentsDialogAssign
      v-model="isAssignDialogOpen"
      :workspace="workspace"
      :project="project"
      @submit="(username) => emit('submitAssign', username)"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Assignments
  text: Define who can access and manage the project. You can add or remove team members, and assign them different permissions. For more information, please refer to the {documentation}.
  text.documentation: documentation
  button.addMember: Assign a member to the project
  header.user: User
  header.permissions: Permissions
  header.actions: ''
fr:
  title: Assignations
  text: Définissez qui peut accéder et gérer le projet. Vous pouvez ajouter ou supprimer des membres de l'équipe et leur attribuer différentes autorisations. Pour plus d'informations, veuillez vous référer à la {documentation}.
  text.documentation: documentation
  button.addMember: Ajouter un membre au projet
  header.user: Utilisateur
  header.permissions: Permissions
  header.actions: ''
de:
  title: Zuweisungen
  text: Legen Sie fest, wer auf das Projekt zugreifen und es verwalten kann. Sie können Teammitglieder hinzufügen oder entfernen und ihnen verschiedene Berechtigungen zuweisen. Weitere Informationen finden Sie in der {documentation}.
  text.documentation: documentation
  button.addMember: Teammitglied hinzufügen
  header.user: Benutzer
  header.permissions: Berechtigungen
  header.actions: ''
es:
  title: Asignaciones
  text: Define quién puede acceder y administrar el proyecto. Puede agregar o eliminar miembros del equipo y asignarles diferentes permisos. Para obtener más información, consulte la {documentation}.
  text.documentation: documentación
  button.addMember: Asignar un miembro al proyecto
  header.user: Usuario
  header.permissions: Permisos
  header.actions: ''
zh:
  title: 分配
  text: 定义谁可以访问和管理项目。您可以添加或删除团队成员，并为他们分配不同的权限。有关更多信息，请参阅 {documentation}。
  text.documentation: 文档
  button.addMember: 将成员分配给项目
  header.user: 用户
  header.permissions: 权限
  header.actions: ''
</i18n>
