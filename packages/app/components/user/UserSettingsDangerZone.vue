<script setup lang="ts">
defineProps<{
  username: string
  displayName: string
  avatarUrl: string
}>()

const emit = defineEmits<{
  submitRename: [value: string]
  submitDelete: []
}>()

const { t } = useI18n()
const isDialogDeleteOpen = ref(false)
const isDialogRenameOpen = ref(false)
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">

    <!-- Actions -->
    <AppPageFormActions class="b-danger">
      <AppPageFormAction
        class="b-danger"
        class-button="button-danger"
        :title="t('changeUsername.title')"
        :text="t('changeUsername.text')"
        :label="t('changeUsername.label')"
        @click="() => isDialogRenameOpen = true"
      />
      <AppPageFormAction
        class="b-danger"
        class-button="button-danger"
        :title="t('deleteUser.title')"
        :text="t('deleteUser.text')"
        :label="t('deleteUser.label')"
        @click="() => isDialogDeleteOpen = true"
      />
    </AppPageFormActions>

    <!-- Rename project dialog -->
    <UserSettingsDangerZoneRenameDialog
      v-model="isDialogRenameOpen"
      :username="username"
      :display-name="displayName"
      :avatar-url="avatarUrl"
      @submit="(name) => emit('submitRename', name)"
    />

    <!-- Delete project dialog -->
    <UserSettingsDangerZoneDeleteDialog
      v-model="isDialogDeleteOpen"
      :username="username"
      :display-name="displayName"
      :avatar-url="avatarUrl"
      @submit="() => emit('submitDelete')"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Danger Zone
  text: Be cautious when making changes in this section. These actions are irreversible and may have a significant impact on your account and data. Proceed with caution.
  changeUsername.title: Change Username
  changeUsername.text: Changing the username might break existing integrations.
  changeUsername.label: Rename
  deleteUser.title: Delete User
  deleteUser.text: This action cannot be undone. All data associated with the user will be lost.
  deleteUser.label: Delete
fr:
  title: Zone de Danger
  text: Soyez prudent lorsque vous apportez des modifications dans cette section. Ces actions sont irréversibles et peuvent avoir un impact significatif sur votre compte et vos données. Procédez avec prudence.
  changeUsername.title: Changer le nom d'utilisateur
  changeUsername.text: Changer le nom d'utilisateur pourrait casser les intégrations existantes.
  changeUsername.label: Renommer
  deleteUser.title: Supprimer l'utilisateur
  deleteUser.text: Cette action est irréversible. Toutes les données associées à l'utilisateur seront perdues.
  deleteUser.label: Supprimer
de:
  title: Gefahrenzone
  text: Seien Sie vorsichtig bei Änderungen in diesem Abschnitt. Diese Aktionen sind nicht rückgängig zu machen und können sich erheblich auf Ihr Konto und Ihre Daten auswirken. Gehen Sie mit Vorsicht vor.
  changeUsername.title: Benutzernamen ändern
  changeUsername.text: Das Ändern des Benutzernamens kann bestehende Integrationen unterbrechen.
  changeUsername.label: Umbenennen
  deleteUser.title: Benutzer löschen
  deleteUser.text: Diese Aktion kann nicht rückgängig gemacht werden. Alle Daten, die mit dem Benutzer verknüpft sind, gehen verloren.
  deleteUser.label: Löschen
es:
  title: Zona de Peligro
  text: Tenga cuidado al realizar cambios en esta sección. Estas acciones son irreversibles y pueden tener un impacto significativo en su cuenta y sus datos. Proceda con precaución.
  changeUsername.title: Cambiar nombre de usuario
  changeUsername.text: Cambiar el nombre de usuario podría romper las integraciones existentes.
  changeUsername.label: Renombrar
  deleteUser.title: Eliminar usuario
  deleteUser.text: Esta acción no se puede deshacer. Todos los datos asociados con el usuario se perderán.
  deleteUser.label: Eliminar
zh:
  title: 危险区
  text: 在此部分进行更改时要小心。这些操作是不可逆的，可能会对您的帐户和数据产生重大影响。请谨慎操作。
  changeUsername.title: 更改用户名
  changeUsername.text: 更改用户名可能会破坏现有的集成。
  changeUsername.label: 重命名
  deleteUser.title: 删除用户
  deleteUser.text: 此操作无法撤消。与用户关联的所有数据将丢失。
  deleteUser.label: 删除
</i18n>
