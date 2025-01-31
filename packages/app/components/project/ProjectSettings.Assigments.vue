<script setup lang="ts">
import type { UserObject, WorkspaceProjectPermission, WorkspaceProjectUserPermissionsObject } from '@nwrx/api'
import type { UUID } from 'node:crypto'

const props = defineProps<{
  workspace: string
  project: string
  title: string
  assigments: WorkspaceProjectUserPermissionsObject[]
  searchUsers: (search: string) => Promise<UserObject[]>
}>()

const emit = defineEmits<{
  submit: [username: string, permissions: WorkspaceProjectPermission[]]
}>()

const { t } = useI18n({ useScope: 'local' })
const assigments = useVModel(props, 'assigments', emit, { passive: true })
const assigmentsSelectedIds = ref<UUID[]>([])
const isAssignDialogOpen = ref(false)
</script>

<template>
  <AppPageForm :title="t('title')">

    <!-- Text -->
    <template #text>
      <I18nT keypath="text">
        <template #newline><br><br></template>
        <template #documentation>
          <Button link variant="primary" :label="t('text.documentation')" :href="CONSTANTS.appCanonicalUrl" />
        </template>
      </I18nT>
    </template>

    <!-- List of assignments -->
    <div class="rounded w-full border border-app">
      <ProjectSettingsAssignmentsItem
        v-for="assignment in assigments"
        :key="assignment.user.username"
        v-model="assigmentsSelectedIds"
        :workspace="workspace"
        :project="project"
        :title="title"
        :username="assignment.user.username"
        :userDisplayName="assignment.user.displayName"
        :userAvatarUrl="assignment.user.avatarUrl"
        :permissions="assignment.permissions"
        @submit="value => emit('submit', assignment.user.username, value)"
      />

      <div class="flex items-center justify-between p-4">
        <Button
          link
          eager
          size="sm"
          icon="i-carbon:add"
          :label="t('button.addMember')"
          @click="() => isAssignDialogOpen = true"
        />
      </div>
    </div>

    <!-- Assign dialog -->
    <ProjectSettingsAssignmentDialogAssign
      v-model="isAssignDialogOpen"
      :workspace="workspace"
      :project="project"
      :title="title"
      :searchUsers="searchUsers"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
  en:
    title: Members
    text: Define who can access and manage the project. You can add or remove team members, and assign them different permissions. For more information, please refer to the {documentation}.
    text.documentation: documentation
    button.addMember: Add a team member
  fr:
    title: Membres
    text: Définissez qui peut accéder et gérer le projet. Vous pouvez ajouter ou supprimer des membres de l'équipe et leur attribuer différentes autorisations. Pour plus d'informations, veuillez vous référer à la {documentation}.
    text.documentation: documentation
    button.addMember: Ajouter un membre à l'équipe
  de:
    title: Mitglieder
    text: Legen Sie fest, wer auf das Projekt zugreifen und es verwalten kann. Sie können Teammitglieder hinzufügen oder entfernen und ihnen verschiedene Berechtigungen zuweisen. Weitere Informationen finden Sie in der {documentation}.
    text.documentation: documentation
    button.addMember: Teammitglied hinzufügen
  es:
    title: Miembros
    text: Define quién puede acceder y administrar el proyecto. Puede agregar o eliminar miembros del equipo y asignarles diferentes permisos. Para obtener más información, consulte la {documentation}.
    text.documentation: documentación
    button.addMember: Agregar un miembro del equipo
  zh:
    title: 成员
    text: 定义谁可以访问和管理项目。您可以添加或删除团队成员，并为他们分配不同的权限。有关更多信息，请参阅 {documentation}。
    text.documentation: 文档
    button.addMember: 添加团队成员
</i18n>
