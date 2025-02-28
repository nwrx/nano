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
}>()

// --- Load i18n instance.
const { t } = useI18n()
</script>

<template>
  <div class="w-full b b-app rd">

    <!-- Table -->
    <BaseTable
      class="w-full"
      :columns="['name', 'email', 'status']"
      class-cell="px-8 py-2"
      class-header="bg-subtle"
      class-row="b-t b-app hover:bg-subtle"
      :rows="users">

      <!-- Header -->
      <template #header="label">
        <div class="w-full font-medium px-lg py-sm text-sm text-start">
          {{ t(`header.${label}`) }}
        </div>
      </template>

      <!-- Cell / Name -->
      <template #cell.name="{ displayName, username }">
        <div class="flex items-center justify-start space-x-md font-normal">
          <UserCard :display-name="displayName" :username="username" />
        </div>
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
            :class="disabledAt ? 'badge-danger' : 'badge-success'"
            :icon="verifiedAt ? 'i-carbon:checkmark' : 'i-carbon:close'"
            :label="verifiedAt ? t('verified') : t('unverified')"
          />
          <Badge
            size="small"
            class="font-normal badge-outlined"
            :class="disabledAt ? 'badge-danger' : 'badge-success'"
            :icon="disabledAt ? 'i-carbon:close' : 'i-carbon:checkmark'"
            :label="disabledAt ? t('disabled') : t('enabled')"
          />
        </div>
      </template>

      <!-- Cell / Actions -->
      <template #cell.status="{ username, displayName, createdAt, disabledAt }">
        <AdminUsersTableCellStatus
          :username="username"
          :display-name="displayName"
          :created-at="createdAt"
          :disabled-at="disabledAt"
          @submit-impersonate="() => emit('submitImpersonate', username)"
          @submit-verify="() => emit('submitVerify', username)"
          @submit-disable="() => emit('submitDisable', username)"
          @submit-enable="() => emit('submitEnable', username)"
          @submit-delete="() => emit('submitDelete', username)"
        />
      </template>
    </BaseTable>
  </div>
</template>

<i18n lang="yaml">
en:
  header.name: Name
  header.email: Email
  header.status: Status
  disabled: Disabled
  enabled: Enabled
  verified: Verified
  unverified: Unverified
  createdAt: Created at {date}
  lastSeen: Last seen {distance}
fr:
  header.name: Nom
  header.email: Email
  header.status: Statut
  disabled: Désactivé
  enabled: Activé
  verified: Vérifié
  unverified: Non vérifié
  createdAt: Créé le {date}
  lastSeen: Dernière connexion {distance}
de:
  header.name: Name
  header.email: E-Mail
  header.status: Status
  disabled: Deaktiviert
  enabled: Aktiviert
  verified: Verifiziert
  unverified: Nicht verifiziert
  createdAt: Erstellt am {date}
  lastSeen: Zuletzt gesehen {distance}
es:
  header.name: Nombre
  header.email: Correo electrónico
  header.status: Estado
  disabled: Desactivado
  enabled: Activado
  verified: Verificado
  unverified: No verificado
  createdAt: Creado en {date}
  lastSeen: Última vez visto {distance}
zh:
  header.name: 名称
  header.email: 电子邮件
  header.status: 状态
  disabled: 已禁用
  enabled: 已启用
  verified: 已验证
  unverified: 未验证
  createdAt: 创建于 {date}
  lastSeen: 上次查看 {distance}
</i18n>
