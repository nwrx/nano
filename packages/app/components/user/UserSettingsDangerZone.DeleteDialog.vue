<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  username: string
  displayName: string
  avatarUrl: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

const { t } = useI18n({ useScope: 'local' })
const model = useVModel(props, 'modelValue', emit, { passive: true })
const confirm = ref('')
</script>

<template>
  <AppDialog
    v-model="model"
    class-hint="hint-danger"
    icon="i-carbon:trash-can"
    :title="t('title', { displayName })"
    :text="t('hint', { username })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirm !== username"
    @confirm="() => emit('submit')">

    <!-- User card -->
    <UserCard
      :username="username"
      :display-name="displayName"
      :avatar-url="avatarUrl"
    />

    <!-- Confirmation input -->
    <InputText
      v-model="confirm"
      class="mt-md"
      :hint="t('message')"
      :placeholder="username"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Delete the user **{displayName}**?
  hint: You are about to delete the user. This action is irreversible and will permanently delete all data associated with the user. Please confirm that you understand the consequences of this action.
  message: Confirm by typing the username below.
  cancel: Keep the user
  confirm: I understand, delete the user
fr:
  title: Supprimer l'utilisateur **{displayName}** ?
  hint: Vous êtes sur le point de supprimer l'utilisateur. Cette action est irréversible et supprimera définitivement toutes les données associées à l'utilisateur. Veuillez confirmer que vous comprenez les conséquences de cette action.
  message: Confirmez en tapant le nom d'utilisateur ci-dessous.
  cancel: Conserver l'utilisateur
  confirm: Je comprends, supprimer l'utilisateur
de:
  title: Löschen des Benutzers **{displayName}**?
  hint: Sie sind dabei, den Benutzer zu löschen. Diese Aktion ist nicht rückgängig zu machen und löscht alle mit dem Benutzer verbundenen Daten dauerhaft. Bitte bestätigen Sie, dass Sie die Konsequenzen dieser Aktion verstehen.
  message: Bestätigen Sie, indem Sie den Benutzernamen unten eingeben.
  cancel: Benutzer behalten
  confirm: Ich verstehe, den Benutzer löschen
es:
  title: ¿Eliminar al usuario **{displayName}**?
  hint: Estás a punto de eliminar al usuario. Esta acción es irreversible y eliminará permanentemente todos los datos asociados con el usuario. Por favor, confirma que entiendes las consecuencias de esta acción.
  message: Confirma escribiendo el nombre de usuario a continuación.
  cancel: Mantener al usuario
  confirm: Entiendo, eliminar al usuario
zh:
  title: 删除用户 **{displayName}**？
  hint: 您即将删除用户。此操作是不可逆的，将永久删除与用户关联的所有数据。请确认您理解此操作的后果。
  message: 通过在下面输入用户名来确认。
  cancel: 保留用户
  confirm: 我明白，删除用户
</i18n>
