<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  username: string
  displayName: string
  avatarUrl: string
}>()

const emit = defineEmits<{
  'submit': [name: string]
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
const name = ref('')
</script>

<template>
  <AppDialog
    v-model="model"
    class-hint="hint-warning"
    icon="i-carbon:edit"
    :title="t('title', { displayName })"
    :text="t('hint', { username })"
    :labelCancel="t('cancel')"
    :labelConfirm="t('confirm')"
    :disabled="!name"
    @confirm="() => emit('submit', name!)">

    <!-- User card -->
    <UserCard
      :username="username"
      :displayName="displayName"
      :avatarUrl="avatarUrl"
    />

    <!-- New name input -->
    <InputText
      v-model="name"
      class="mt-md"
      :hint="t('message')"
      :placeholder="t('placeholder')"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
  en:
    title: Change the username of **{displayName}**?
    hint: You are about to rename the user. Keep in mind that this will also rename your personal workspace and all associated projects. Meaning that all integrations relying on the URLs of your flows will be broken. Please confirm that you understand the consequences of this action.
    message: Define the new username below.
    placeholder: new-username
    confirm: I understand, change anyway
    cancel: Keep my username as-is
  fr:
    title: Changer le nom d'utilisateur de **{displayName}** ?
    hint: Vous êtes sur le point de renommer l'utilisateur. Gardez à l'esprit que cela renommera également votre espace de travail personnel et tous les projets associés. Cela signifie que toutes les intégrations reposant sur les URL de vos flux seront rompues. Veuillez confirmer que vous comprenez les conséquences de cette action.
    message: Définissez le nouveau nom d'utilisateur ci-dessous.
    placeholder: nouveau-nom-d-utilisateur
    confirm: Je comprends, changer quand même
    cancel: Conserver tel quel
  de:
    title: Benutzernamen von **{displayName}** ändern?
    hint: Sie sind dabei, den Benutzer umzubenennen. Beachten Sie, dass dadurch auch Ihr persönlicher Arbeitsbereich und alle zugehörigen Projekte umbenannt werden. Dies bedeutet, dass alle Integrationen, die auf den URLs Ihrer Flows basieren, unterbrochen werden. Bitte bestätigen Sie, dass Sie die Konsequenzen dieser Aktion verstehen.
    message: Definieren Sie den neuen Benutzernamen unten.
    placeholder: neuer-benutzername
    confirm: Ich verstehe, trotzdem ändern
    cancel: Behalte meinen Benutzernamen wie er ist
  es:
    title: ¿Cambiar el nombre de **{displayName}**?
    hint: Estás a punto de cambiar el nombre del usuario. Esto también cambiará tu espacio de trabajo y proyectos asociados, rompiendo integraciones que dependen de las URL de tus flujos. Confirma que entiendes las consecuencias.
    message: Define el nuevo nombre a continuación.
    placeholder: nuevo-nombre
    confirm: Entiendo, cambiar
    cancel: Mantener nombre
  zh:
    title: 更改 **{displayName}** 的用户名？
    hint: 您即将重命名用户。请记住，这也将重命名您的个人工作区和所有关联的项目。这意味着所有依赖于您的流程 URL 的集成都将中断。请确认您理解此操作的后果。
    message: 在下面定义新用户名。
    placeholder: xin-yonghu-ming
    confirm: 我明白，无论如何更改
    cancel: 保持我的用户名不变
</i18n>
