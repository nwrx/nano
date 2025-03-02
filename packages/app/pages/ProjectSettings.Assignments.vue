<script setup lang="ts">
definePageMeta({
  name: 'ProjectSettingsAssignments',
  path: '/:workspace/:project/settings/assignments',
  middleware: 'redirect-when-guest',
  layout: 'project-settings',
  icon: 'i-carbon:group',
  title: {
    en: 'Members & Access',
    fr: 'Membres et accès',
    de: 'Mitglieder & Zugriff',
    es: 'Miembros y acceso',
    zh: '成员和访问',
  },
  description: {
    en: 'Define who can access and manage the project. You can add or remove team members, and assign them different permissions.',
    fr: 'Définissez qui peut accéder et gérer le projet. Vous pouvez ajouter ou supprimer des membres de l\'équipe et leur attribuer différentes autorisations.',
    de: 'Legen Sie fest, wer auf das Projekt zugreifen und es verwalten kann. Sie können Teammitglieder hinzufügen oder entfernen und ihnen unterschiedliche Berechtigungen zuweisen.',
    es: 'Defina quién puede acceder y gestionar el proyecto. Puede agregar o eliminar miembros del equipo y asignarles diferentes permisos.',
    zh: '定义谁可以访问和管理项目。您可以添加或删除团队成员，并为他们分配不同的权限。',
  },
})

// --- Route.
const { t } = useI18n()
const route = useRoute()
const project = computed(() => route.params.project as string)
const workspace = computed(() => route.params.workspace as string)

// --- Data.
const { assignments, getAssignments, setUserAssignments } = useProject(workspace, project)
onMounted(getAssignments)
</script>

<template>
  <AppPageContainer contained>
    <AppPageForm
      vertical
      :title="localize(route.meta.title)"
      :text="localize(route.meta.description)">
      <div class="rd w-full b b-app">
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
              {{ t(`assignments.table.header.${name}`) }}
            </div>
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
            <div class="flex items-center space-x-2">
              <Badge
                v-for="permission in permissions"
                :key="permission"
                :label="t(`assignments.roles.${permission}.label`)"
              />
            </div>
          </template>

          <!-- Cell / Actions -->
          <template #cell.actions="assignment">
            <Trigger v-slot="dialogs" :keys="['edit', 'unassign']">
              <div class="flex items-center justify-end space-x-md">
                <ContextMenu x="right" y="top">
                  <template #menu>
                    <ContextMenuItem icon="i-carbon:edit" :label="t('assignments.actions.manage')" @click="() => dialogs.open('edit')" />
                    <ContextMenuItem icon="i-carbon:delete" :label="t('assignments.actions.unassign')" @click="() => dialogs.open('unassign')" />
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
                  :title="t('assignments.dialog.edit.title', { workspace, project, username: assignment.username })"
                  :text="t('assignments.dialog.edit.text', { workspace, project, username: assignment.username })"
                  :label-cancel="t('assignments.dialog.edit.cancel')"
                  :label-confirm="t('assignments.dialog.edit.confirm')"
                  @confirm="() => setUserAssignments(assignment.username, value.permissions)">
                  <div class="space-y-4">
                    <AppDialogToggle
                      v-for="role in ['Owner', 'Write', 'Read'] as const"
                      :key="role"
                      v-model="value.permissions"
                      :value="role"
                      type="checkbox"
                      :label="t(`assignments.roles.${role}.label`)"
                      :text="t(`assignments.roles.${role}.text`)"
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
                :title="t('assignments.dialog.unassign.title', { workspace, project, username: assignment.username })"
                :text="t('assignments.dialog.unassign.text', { workspace, project, username: assignment.username })"
                :label-cancel="t('assignments.dialog.unassign.cancel')"
                :label-confirm="t('assignments.dialog.unassign.confirm')"
                @confirm="() => setUserAssignments(assignment.username, [])">
                <UserCard
                  :display-name="assignment.displayName"
                  :username="assignment.username"
                />
              </Dialog>
            </Trigger>
          </template>
        </BaseTable>
      </div>

      <Trigger v-slot="dialogs" :keys="['assign']">
        <Hyperlink
          eager
          class="text-sm"
          icon="i-carbon:add"
          :label="t('assignments.actions.addMember')"
          @click="() => dialogs.open('assign')"
        />

        <Ephemeral v-slot="model" :initial-value="[] as string[]">
          <Dialog
            v-model="dialogs.value.assign"
            icon="i-carbon:add"
            class-hint="hint-success"
            class-button="button-success"
            :title="t('assignments.dialog.assign.title', { workspace, project })"
            :text="t('assignments.dialog.assign.text', { workspace, project })"
            :label-cancel="t('assignments.dialog.assign.cancel')"
            :label-confirm="t('assignments.dialog.assign.confirm')"
            @confirm="() => setUserAssignments(model.value[0], ['Read'])">
            <UserSearch v-model="model.value" />
          </Dialog>
        </Ephemeral>
      </Trigger>
    </AppPageForm>
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  assignments:
    table:
      header:
        user: User
        permissions: Permissions
        actions: ''
    actions:
      addMember: Assign a member to the project
      manage: Manage
      unassign: Unassign
    dialog:
      assign:
        title: Assign a new member to **{workspace}/{project}**
        text: Select a user to assign to the project. The user will gain access according to the permissions you set.
        cancel: Cancel
        confirm: Assign member
      edit:
        title: Manage permissions for **{username}** in **{workspace}/{project}**
        text: Adjust permissions carefully. Owners have full control over the project.
        cancel: Cancel
        confirm: Update permissions
      unassign:
        title: Unassign **{username}** from **{workspace}/{project}**
        text: This user will lose all access to the project and related resources. This action cannot be undone.
        cancel: Cancel
        confirm: Unassign user
    roles:
      Owner:
        label: Owner
        text: Full control over the project and its resources.
      Write:
        label: Write
        text: Can edit project settings and resources.
      Read:
        label: Read
        text: Can view project settings and resources.
fr:
  assignments:
    table:
      header:
        user: Utilisateur
        permissions: Autorisations
        actions: ''
    actions:
      addMember: Assigner un membre au projet
      manage: Gérer
      unassign: Désassigner
    dialog:
      assign:
        title: Assigner un nouveau membre à **{workspace}/{project}**
        text: Sélectionnez un utilisateur à assigner au projet. L'utilisateur aura accès en fonction des autorisations que vous définissez.
        cancel: Annuler
        confirm: Assigner le membre
      edit:
        title: Gérer les autorisations pour **{username}** dans **{workspace}/{project}**
        text: Ajustez les autorisations avec soin. Les propriétaires ont un contrôle total sur le projet.
        cancel: Annuler
        confirm: Mettre à jour les autorisations
      unassign:
        title: Désassigner **{username}** de **{workspace}/{project}**
        text: Cet utilisateur perdra tout accès au projet et aux ressources associées. Cette action ne peut pas être annulée.
        cancel: Annuler
        confirm: Désassigner l'utilisateur
    roles:
      Owner:
        label: Propriétaire
        text: Contrôle total sur le projet et ses ressources.
      Write:
        label: Écrire
        text: Peut modifier les paramètres du projet et les ressources.
      Read:
        label: Lire
        text: Peut consulter les paramètres du projet et les ressources.
</i18n>
