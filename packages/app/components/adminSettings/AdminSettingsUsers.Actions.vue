<script setup lang="ts">
import type { UserObject } from '@nwrx/nano-api'

defineProps<{ user: UserObject }>()
const emit = defineEmits<{ 'submit': [] }>()

const { t } = useI18n()
const showImpersonate = ref(false)
const showVerify = ref(false)
const showDisable = ref(false)
const showEnable = ref(false)
const showDelete = ref(false)
</script>

<template>
  <ContextMenu x="right" y="top" @mousedown.stop>
    <template #menu>
      <ContextMenuItem
        :label="t('menuImpersonate')"
        icon="i-carbon:login"
        @click="() => showImpersonate = true"
      />
      <ContextMenuItem
        v-if="!user.verifiedAt"
        :label="t('menuVerify')"
        icon="i-carbon:checkmark-outline"
        @click="() => showVerify = true"
      />
      <ContextMenuDivider />
      <ContextMenuItem
        v-if="!user.disabledAt"
        :label="t('menuDisable')"
        icon="i-carbon:close"
        @click="() => showDisable = true"
      />
      <ContextMenuItem
        v-if="user.disabledAt"
        :label="t('menuEnable')"
        icon="i-carbon:checkmark"
        @click="() => showEnable = true"
      />
      <ContextMenuItem
        :label="t('menuDelete')"
        icon="i-carbon:trash-can"
        @click="() => showDelete = true"
      />
    </template>
  </ContextMenu>

  <!-- Impersonate Dialog -->
  <AdminSettingsUsersDialogImpersonate
    v-model="showImpersonate"
    :user="user"
  />

  <!-- Delete Dialog -->
  <AdminSettingsUsersDialogDelete
    v-model="showDelete"
    :user="user"
    @submit="() => emit('submit')"
  />

  <!-- Disable Dialog -->
  <AdminSettingsUsersDialogDisable
    v-model="showDisable"
    :user="user"
    @submit="() => emit('submit')"
  />

  <!-- Enable Dialog -->
  <AdminSettingsUsersDialogEnable
    v-model="showEnable"
    :user="user"
    @submit="() => emit('submit')"
  />

  <!-- Verify Dialog -->
  <AdminSettingsUsersDialogVerify
    v-model="showVerify"
    :user="user"
    @submit="() => emit('submit')"
  />
</template>

<i18n lang="yaml">
en:
  menuImpersonate: Impersonate User
  menuVerify: Verify Email
  menuDisable: Disable Account
  menuEnable: Enable Account
  menuDelete: Delete User
fr:
  menuImpersonate: Incarner l'Utilisateur
  menuVerify: Vérifier l'Email
  menuDisable: Désactiver le Compte
  menuEnable: Activer le Compte
  menuDelete: Supprimer l'Utilisateur
de:
  menuImpersonate: Benutzer Verkörpern
  menuVerify: E-Mail Verifizieren
  menuDisable: Konto Deaktivieren
  menuEnable: Konto Aktivieren
  menuDelete: Benutzer Löschen
es:
  menuImpersonate: Personificar Usuario
  menuVerify: Verificar Email
  menuDisable: Deshabilitar Cuenta
  menuEnable: Habilitar Cuenta
  menuDelete: Eliminar Usuario
zh:
  menuImpersonate: 模拟用户
  menuVerify: 验证邮箱
  menuDisable: 禁用账户
  menuEnable: 启用账户
  menuDelete: 删除用户
</i18n>
