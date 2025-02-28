<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
  project: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [username: string]
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
const search = ref<string>('')
const username = ref<string[]>([])

// --- Reset when dialog is closed/opened.
watch(model, () => {
  search.value = ''
  username.value = []
})
</script>

<template>
  <AppDialog
    v-model="model"
    icon="i-carbon:warning"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { workspace, project })"
    :text="t('text', { workspace, project })"
    :label-cancel="t('button.cancel')"
    :label-confirm="t('button.confirm')"
    :disabled="username.length === 0"
    @confirm="() => emit('submit', username[0])">

    <!-- Search -->
    <UserSearch
      v-model="username"
      v-model:search="search"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Assign a new member to the **{workspace}/{project}** project
  text: You are about to assign a new member to the **{workspace}/{project}** project. Please select a user from the list below. Keep in mind that the user will be able to access and manage the project according to the permissions you assign, be careful with the permissions you grant.
  search.label: Search for a user by name or username to assign to the project
  button.assign: Assign
  button.cancel: Don't assign
  button.confirm: Assign the user to the project
fr:
  title: Assigner un nouveau membre au projet **{workspace}/{project}**
  text: Vous êtes sur le point d'assigner un nouveau membre au projet **{workspace}/{project}**. Veuillez sélectionner un utilisateur dans la liste ci-dessous. Gardez à l'esprit que l'utilisateur pourra accéder et gérer le projet en fonction des autorisations que vous attribuez, soyez prudent avec les autorisations que vous accordez.
  search.label: Rechercher un utilisateur par nom ou nom d'utilisateur à assigner au projet
  button.assign: Assigner
  button.cancel: Ne pas assigner
  button.confirm: Assigner l'utilisateur au projet
de:
  title: Weisen Sie einem neuen Mitglied das Projekt **{workspace}/{project}** zu
  text: Sie sind dabei, einem neuen Mitglied das Projekt **{workspace}/{project}** zuzuweisen. Bitte wählen Sie einen Benutzer aus der Liste unten aus. Beachten Sie, dass der Benutzer je nach den von Ihnen zugewiesenen Berechtigungen auf das Projekt zugreifen und es verwalten kann. Seien Sie vorsichtig mit den Berechtigungen, die Sie gewähren.
  search.label: Suchen Sie nach einem Benutzer nach Namen oder Benutzernamen, um ihn dem Projekt zuzuweisen
  button.assign: Zuweisen
  button.cancel: Nicht zuweisen
  button.confirm: Weisen Sie den Benutzer dem Projekt zu
es:
  title: Asignar un nuevo miembro al proyecto **{workspace}/{project}**
  text: Estás a punto de asignar un nuevo miembro al proyecto **{workspace}/{project}**. Por favor, selecciona un usuario de la lista a continuación. Ten en cuenta que el usuario podrá acceder y gestionar el proyecto según los permisos que le asignes, ten cuidado con los permisos que otorgas.
  search.label: Busca un usuario por nombre o nombre de usuario para asignar al proyecto
  button.assign: Asignar
  button.cancel: No asignar
  button.confirm: Asignar el usuario al proyecto
zh:
  title: 将新成员分配给项目 **{workspace}/{project}**
  text: 您即将将新成员分配给项目 **{workspace}/{project}**。请从下面的列表中选择一个用户。请注意，根据您分配的权限，用户将能够访问和管理项目，请注意您授予的权限。
  search.label: 按名称或用户名搜索用户以分配给项目
  button.assign: 分配
  button.cancel: 不分配
  button.confirm: 将用户分配给项目
</i18n>
