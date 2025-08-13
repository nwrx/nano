<script setup lang="ts">
import type { UserObject } from '@nwrx/nano-api'
import { toCamelCase } from '@unshared/string/toCamelCase'

const { t } = useI18n()
const client = useClient()
const users = ref<UserObject[]>([])
const showCreate = ref(false)

async function getUsers() {
  await client.requestAttempt('GET /users', {
    query: {
      withProfile: true,
      withProtected: true,
    },
    onData: (data) => {
      users.value = data
    },
  })
}

onMounted(getUsers)
</script>

<template>
  <AppPageForm vertical :title="t('title')" :text="t('text')">
    <Table :columns="['name', 'email', 'status']" :rows="users">

      <!-- Header -->
      <template #header="name">
        {{ t(toCamelCase('header', name)) }}
      </template>

      <!-- Cell / Name -->
      <template #cell.name="user">
        <UserCard
          :display-name="user.displayName"
          :username="user.username"
        />
      </template>

      <!-- Cell / Email -->
      <template #cell.email="{ email, verifiedAt, disabledAt }">
        <div class="flex items-center justify-start space-x-md font-normal">
          <Badge
            size="small"
            :label="email"
            class="font-normal badge-soft"
            :class="verifiedAt ? 'badge-primary' : 'badge-danger'"
          />
          <Badge
            size="small"
            class="font-normal badge-soft"
            :class="verifiedAt ? 'badge-success' : 'badge-danger'"
            :icon="verifiedAt ? 'i-carbon:checkmark' : 'i-carbon:close'"
            :label="verifiedAt ? t('statusVerified') : t('statusUnverified')"
          />
          <Badge
            size="small"
            class="font-normal badge-outlined"
            :class="disabledAt ? 'badge-danger' : 'badge-success'"
            :icon="disabledAt ? 'i-carbon:close' : 'i-carbon:checkmark'"
            :label="disabledAt ? t('statusDisabled') : t('statusEnabled')"
          />
        </div>
      </template>

      <!-- Cell / Actions -->
      <template #cell.status="user">
        <AdminSettingsUsersActions
          :user="user"
          @submit="() => getUsers()"
        />
      </template>
    </Table>

    <!-- Create Button -->
    <Hyperlink
      eager
      class="text-sm ml-auto mb-4"
      icon="i-carbon:add"
      icon-append="i-carbon:chevron-right"
      :label="t('create')"
      @click="() => showCreate = true"
    />

    <!-- Create Dialog -->
    <AdminSettingsUsersDialogCreate
      v-model="showCreate"
      @submit="() => getUsers()"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: User Management
  text: Comprehensive user administration for your platform ecosystem. Manage local user accounts, monitor verification status, and control access permissions. External authentication provider users are managed through their respective systems.
  create: Add New User
  headerName: User Profile
  headerEmail: Authentication & Status
  headerStatus: Actions
  statusVerified: Email Verified
  statusUnverified: Pending Verification
  statusEnabled: Active
  statusDisabled: Suspended
fr:
  title: Gestion des Utilisateurs
  text: Administration complète des utilisateurs pour votre écosystème de plateforme. Gérez les comptes utilisateurs locaux, surveillez le statut de vérification et contrôlez les permissions d'accès. Les utilisateurs des fournisseurs d'authentification externes sont gérés via leurs systèmes respectifs.
  create: Ajouter un Nouvel Utilisateur
  headerName: Profil Utilisateur
  headerEmail: Authentification et Statut
  headerStatus: Actions
  statusVerified: Email Vérifié
  statusUnverified: Vérification en Attente
  statusEnabled: Actif
  statusDisabled: Suspendu
de:
  title: Benutzerverwaltung
  text: Umfassende Benutzerverwaltung für Ihr Plattform-Ökosystem. Verwalten Sie lokale Benutzerkonten, überwachen Sie den Verifizierungsstatus und kontrollieren Sie Zugriffsberechtigungen. Benutzer externer Authentifizierungsanbieter werden über ihre jeweiligen Systeme verwaltet.
  create: Neuen Benutzer Hinzufügen
  headerName: Benutzerprofil
  headerEmail: Authentifizierung & Status
  headerStatus: Aktionen
  statusVerified: E-Mail Verifiziert
  statusUnverified: Verifizierung Ausstehend
  statusEnabled: Aktives
  statusDisabled: Gesperrt
es:
  title: Gestión de Usuarios
  text: Administración integral de usuarios para su ecosistema de plataforma. Gestione cuentas de usuario locales, monitoree el estado de verificación y controle permisos de acceso. Los usuarios de proveedores de autenticación externos se gestionan a través de sus sistemas respectivos.
  create: Agregar Nuevo Usuario
  headerName: Perfil de Usuario
  headerEmail: Autenticación y Estado
  headerStatus: Acciones
  statusVerified: Email Verificado
  statusUnverified: Verificación Pendiente
  statusEnabled: Activa
  statusDisabled: Suspendida
zh:
  title: 用户管理
  text: 为您的平台生态系统提供全面的用户管理。管理本地用户账户，监控验证状态，控制访问权限。外部身份验证提供商的用户通过其各自系统进行管理。
  create: 添加新用户
  headerName: 用户档案
  headerEmail: 身份验证与状态
  headerStatus: 操作
  statusVerified: 邮箱已验证
  statusUnverified: 待验证
  statusEnabled: 活跃
  statusDisabled: 已禁用
</i18n>
