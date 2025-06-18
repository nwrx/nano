<script setup lang="ts">
defineProps<{ username: string }>()
const { t } = useI18n()
const showRenameDialog = ref(false)
const showDeleteDialog = ref(false)
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">

    <!-- Actions -->
    <AppPageFormActions class="b-danger">
      <AppPageFormAction
        class="b-danger"
        class-button="button-danger"
        icon="i-carbon:edit"
        :text="t('actionsRenameText')"
        :title="t('actionsRenameTitle')"
        :label="t('actionsRenameLabel')"
        @click="() => showRenameDialog = true"
      />
      <AppPageFormAction
        class="b-danger"
        class-button="button-danger"
        icon="i-carbon:trash-can"
        :text="t('actionsDeleteText')"
        :title="t('actionsDeleteTitle')"
        :label="t('actionsDeleteLabel')"
        @click="() => showDeleteDialog = true"
      />
    </AppPageFormActions>

    <!-- Rename user dialog -->
    <UserSettingsDangerZoneDialogRename
      v-model="showRenameDialog"
      :username="username"
    />

    <!-- Delete user dialog -->
    <UserSettingsDangerZoneDialogDelete
      v-model="showDeleteDialog"
      :username="username"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Danger Zone
  text: Be cautious when making changes in this section. These actions are **irreversible** and may have a significant impact on your account and data. Proceed with caution.
  actionsRenameTitle: Change Username
  actionsRenameText: Changing the username might break existing integrations.
  actionsRenameLabel: Change Username
  actionsDeleteTitle: Delete the user
  actionsDeleteText: This action cannot be undone. All data associated with the user will be lost.
  actionsDeleteLabel: Delete User
es:
  title: Zona de Peligro
  text: Ten cuidado al realizar cambios en esta sección. Estas acciones son **irreversibles** y pueden tener un impacto significativo en tu cuenta y datos. Procede con precaución.
  actionsRenameTitle: Cambiar Nombre de Usuario
  actionsRenameText: Cambiar el nombre de usuario podría romper las integraciones existentes.
  actionsRenameLabel: Cambiar Nombre de Usuario
  actionsDeleteTitle: Eliminar el usuario
  actionsDeleteText: Esta acción no se puede deshacer. Todos los datos asociados con el usuario se perderán.
  actionsDeleteLabel: Eliminar Usuario
fr:
  title: Zone de Danger
  text: Soyez prudent lorsque vous apportez des modifications dans cette section. Ces actions sont **irréversibles** et peuvent avoir un impact significatif sur votre compte et vos données. Procédez avec prudence.
  actionsRenameTitle: Changer le Nom d'Utilisateur
  actionsRenameText: Changer le nom d'utilisateur pourrait casser les intégrations existantes.
  actionsRenameLabel: Changer le Nom d'Utilisateur
  actionsDeleteTitle: Supprimer l'utilisateur
  actionsDeleteText: Cette action ne peut pas être annulée. Toutes les données associées à l'utilisateur seront perdues.
  actionsDeleteLabel: Supprimer l'Utilisateur
de:
  title: Gefahrenzone
  text: Seien Sie vorsichtig, wenn Sie Änderungen in diesem Bereich vornehmen. Diese Aktionen sind **unumkehrbar** und können erhebliche Auswirkungen auf Ihr Konto und Ihre Daten haben. Gehen Sie mit Vorsicht vor.
  actionsRenameTitle: Benutzername Ändern
  actionsRenameText: Das Ändern des Benutzernamens könnte bestehende Integrationen beschädigen.
  actionsRenameLabel: Benutzername Ändern
  actionsDeleteTitle: Benutzer löschen
  actionsDeleteText: Diese Aktion kann nicht rückgängig gemacht werden. Alle mit dem Benutzer verbundenen Daten gehen verloren.
  actionsDeleteLabel: Benutzer Löschen
zh:
  title: 危险区域
  text: 在此部分进行更改时请谨慎。这些操作是**不可逆的**，可能对您的账户和数据产生重大影响。请谨慎操作。
  actionsRenameTitle: 更改用户名
  actionsRenameText: 更改用户名可能会破坏现有的集成。
  actionsRenameLabel: 更改用户名
  actionsDeleteTitle: 删除用户
  actionsDeleteText: 此操作无法撤销。与用户相关的所有数据都将丢失。
  actionsDeleteLabel: 删除用户
</i18n>
