<script setup lang="ts">
import AppPageFormAction from '~/components/app/AppPageForm.Action.vue'
import AppPageFormActions from '~/components/app/AppPageForm.Actions.vue'
import AppPageForm from '~/components/app/AppPageForm.vue'
import MyDialogDelete from './MyDialogDelete.vue'
import MyDialogRename from './MyDialogRename.vue'

const { t } = useI18n()
const user = useSession()
const showRenameDialog = ref(false)
const showDeleteDialog = ref(false)
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">

    <!-- Actions -->
    <AppPageFormActions class="b-danger">
      <AppPageFormAction
        class="b-warning"
        class-button="button-warning"
        icon="i-carbon:edit"
        :text="t('renameText')"
        :title="t('renameTitle')"
        :label="t('renameLabel')"
        @click="() => showRenameDialog = true"
      />
      <AppPageFormAction
        class="b-danger"
        class-button="button-danger"
        icon="i-carbon:trash-can"
        :text="t('deleteText')"
        :title="t('deleteTitle')"
        :label="t('deleteLabel')"
        @click="() => showDeleteDialog = true"
      />
    </AppPageFormActions>

    <!-- Rename user dialog -->
    <MyDialogRename
      v-model="showRenameDialog"
      :username="user.data.username"
    />

    <!-- Delete user dialog -->
    <MyDialogDelete
      v-model="showDeleteDialog"
      :username="user.data.username"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Danger Zone
  text: Be cautious when making changes in this section. These actions are **irreversible** and may have a significant impact on your account and data. Proceed with caution.
  renameTitle: Change Username
  renameText: Changing the username might break existing integrations.
  renameLabel: Change Username
  deleteTitle: Delete the user
  deleteText: This action cannot be undone. All data associated with the user will be lost.
  deleteLabel: Delete User
es:
  title: Zona de Peligro
  text: Ten cuidado al realizar cambios en esta sección. Estas acciones son **irreversibles** y pueden tener un impacto significativo en tu cuenta y datos. Procede con precaución.
  renameTitle: Cambiar Nombre de Usuario
  renameText: Cambiar el nombre de usuario podría romper las integraciones existentes.
  renameLabel: Cambiar Nombre de Usuario
  deleteTitle: Eliminar el usuario
  deleteText: Esta acción no se puede deshacer. Todos los datos asociados con el usuario se perderán.
  deleteLabel: Eliminar Usuario
fr:
  title: Zone de Danger
  text: Soyez prudent lorsque vous apportez des modifications dans cette section. Ces actions sont **irréversibles** et peuvent avoir un impact significatif sur votre compte et vos données. Procédez avec prudence.
  renameTitle: Changer le Nom d'Utilisateur
  renameText: Changer le nom d'utilisateur pourrait casser les intégrations existantes.
  renameLabel: Changer le Nom d'Utilisateur
  deleteTitle: Supprimer l'utilisateur
  deleteText: Cette action ne peut pas être annulée. Toutes les données associées à l'utilisateur seront perdues.
  deleteLabel: Supprimer l'Utilisateur
de:
  title: Gefahrenzone
  text: Seien Sie vorsichtig, wenn Sie Änderungen in diesem Bereich vornehmen. Diese Aktionen sind **unumkehrbar** und können erhebliche Auswirkungen auf Ihr Konto und Ihre Daten haben. Gehen Sie mit Vorsicht vor.
  renameTitle: Benutzername Ändern
  renameText: Das Ändern des Benutzernamens könnte bestehende Integrationen beschädigen.
  renameLabel: Benutzername Ändern
  deleteTitle: Benutzer löschen
  deleteText: Diese Aktion kann nicht rückgängig gemacht werden. Alle mit dem Benutzer verbundenen Daten gehen verloren.
  deleteLabel: Benutzer Löschen
zh:
  title: 危险区域
  text: 在此部分进行更改时请谨慎。这些操作是**不可逆的**，可能对您的账户和数据产生重大影响。请谨慎操作。
  renameTitle: 更改用户名
  renameText: 更改用户名可能会破坏现有的集成。
  renameLabel: 更改用户名
  deleteTitle: 删除用户
  deleteText: 此操作无法撤销。与用户相关的所有数据都将丢失。
  deleteLabel: 删除用户
</i18n>
