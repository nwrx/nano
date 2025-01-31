<script setup lang="ts">
import type { UserObject } from '@nwrx/api'

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
const { t } = useI18n({ useScope: 'local' })
</script>

<template>
  <div class="w-full border border-app rounded">

    <!-- Table -->
    <BaseTable
      class="w-full"
      :columns="['name', 'email', 'status']"
      class-cell="px-8 py-2"
      class-row="border-t border-app hover:bg-subtle"
      :rows="users">

      <!-- Header -->
      <template #header="label">
        <div class="w-full font-medium px-lg py-sm text-sm text-start">
          {{ t(`header.${label}`) }}
        </div>
      </template>

      <!-- Cell / Name -->
      <template #cell.name="{ displayName, username, avatarUrl }">
        <div class="flex items-center justify-start space-x-md font-normal">
          <div
            class="size-10 bg-cover bg-center rounded-full"
            :style="{ backgroundImage: `url(${avatarUrl})` }"
          />
          <div class="text-start">
            <p class="font-medium">{{ displayName }}</p>
            <p class="text-sm">{{ username }}</p>
          </div>
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
      <template #cell.status="{ username, displayName, avatarUrl, createdAt, lastSeenAt, disabledAt }">
        <AdminUsersTableCellStatus
          :username="username"
          :displayName="displayName"
          :avatarUrl="avatarUrl"
          :createdAt="createdAt"
          :lastSeenAt="lastSeenAt"
          :disabledAt="disabledAt"
          @submitImpersonate="() => emit('submitImpersonate', username)"
          @submitVerify="() => emit('submitVerify', username)"
          @submitDisable="() => emit('submitDisable', username)"
          @submitEnable="() => emit('submitEnable', username)"
          @submitDelete="() => emit('submitDelete', username)"
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
