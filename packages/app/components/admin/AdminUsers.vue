<script setup lang="ts">
import type { UserObject } from '@nwrx/nano-api'

defineProps<{
  users: UserObject[]
}>()

const emit = defineEmits<{
  'submitImpersonate': [username: string]
  'submitVerify': [username: string]
  'submitDisable': [username: string]
  'submitEnable': [username: string]
  'submitDelete': [username: string]
  'submitCreate': [name: string, value: string]
}>()

// --- Load i18n instance.
const { t } = useI18n()

const isDialogCreateOpen = ref(false)
</script>

<template>
  <AppPageForm
    vertical
    :title="t('title')"
    :text="t('text')">

    <!-- Table -->
    <AdminUsersTable
      :users="users"
      @submit-impersonate="(username) => emit('submitImpersonate', username)"
      @submit-verify="(username) => emit('submitVerify', username)"
      @submit-disable="(username) => emit('submitDisable', username)"
      @submit-enable="(username) => emit('submitEnable', username)"
      @submit-delete="(username) => emit('submitDelete', username)"
    />

    <!-- Create Button -->
    <Hyperlink
      eager
      class="text-sm ml-auto mb-4"
      icon="i-carbon:add"
      icon-append="i-carbon:chevron-right"
      :label="t('create')"
      @click="() => isDialogCreateOpen = true"
    />

    <!-- Create Dialog -->
    <AdminUsersDialogCreate
      v-model="isDialogCreateOpen"
      @submit="(name, value) => emit('submitCreate', name, value)"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Users
  text: Centralized user management for the entire platform. Note that this only lists to locally stored users and does not include users from external authentication providers. To manage users from external providers, please refer to the respective provider's documentation.
  create: Create a new user
fr:
  title: Utilisateurs
  text: Gestion centralisée des utilisateurs pour l'ensemble de la plateforme. Notez que cela ne répertorie que les utilisateurs stockés localement et n'inclut pas les utilisateurs des fournisseurs d'authentification externes. Pour gérer les utilisateurs des fournisseurs externes, veuillez vous référer à la documentation du fournisseur respectif.
  create: Créer un nouvel utilisateur
de:
  title: Benutzer
  text: Zentrales Benutzermanagement für die gesamte Plattform. Beachten Sie, dass hier nur lokal gespeicherte Benutzer aufgelistet sind und keine Benutzer von externen Authentifizierungsanbietern enthalten sind. Um Benutzer von externen Anbietern zu verwalten, konsultieren Sie bitte die Dokumentation des jeweiligen Anbieters.
  create: Neuen Benutzer erstellen
es:
  title: Usuarios
  text: Gestión centralizada de usuarios para toda la plataforma. Tenga en cuenta que esto solo enumera los usuarios almacenados localmente y no incluye usuarios de proveedores de autenticación externos. Para gestionar usuarios de proveedores externos, consulte la documentación del proveedor respectivo.
  create: Crear un nuevo usuario
zh:
  title: 用户
  text: 整个平台的集中用户管理。请注意，此处仅列出本地存储的用户，不包括来自外部身份验证提供程序的用户。要管理来自外部提供程序的用户，请参阅相应提供程序的文档。
  create: 创建新用户
</i18n>
