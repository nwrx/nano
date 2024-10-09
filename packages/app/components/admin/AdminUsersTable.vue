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
  <div class="w-full border border-page rounded bg-page-foreground">

    <!-- Table -->
    <BaseTable
      class="w-full"
      :columns="['name', 'email', 'status']"
      class-cell="px-8 py-2"
      class-row="border-t border-black/10 hover:bg-primary-500/5"
      :rows="users">

      <!-- Header -->
      <template #header="label">
        <div class="w-full font-medium px-8 py-1 text-sm text-start">
          {{ t(`header.${label}`) }}
        </div>
      </template>

      <!-- Cell / Name -->
      <template #cell.name="{ displayName, username, avatarUrl }">
        <div class="flex items-center justify-start space-x-4 font-normal">
          <div
            class="w-10 h-10 bg-cover bg-center rounded-full"
            :style="{ backgroundImage: `url(${avatarUrl})` }"
          />
          <div class="text-start">
            <p class="font-medium">{{ displayName }}</p>
            <p class="text-sm">{{ username }}</p>
          </div>
        </div>
      </template>

      <!-- Cell / Email -->
      <template #cell.email="{ email, verifiedAt }">
        <div class="flex items-center justify-start space-x-4 font-normal">
          <Badge
            size="small"
            class="font-normal"
            :label="email"
            filled
            :variant="verifiedAt ? 'primary' : 'danger'"
          />
          <Badge
            size="small"
            class="font-normal"
            :icon="verifiedAt ? 'i-carbon:checkmark' : 'i-carbon:close'"
            :variant="verifiedAt ? 'success' : 'danger'"
            :label="verifiedAt ? t('verified') : t('unverified')"
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
    verified: Verified
    unverified: Unverified
    createdAt: Created at {date}
    lastSeen: Last seen {distance}
  fr:
    header.name: Nom
    header.email: Email
    header.status: Statut
    verified: Vérifié
    unverified: Non vérifié
    createdAt: Créé le {date}
    lastSeen: Dernière connexion {distance}
  de:
    header.name: Name
    header.email: E-Mail
    header.status: Status
    verified: Verifiziert
    unverified: Nicht verifiziert
    createdAt: Erstellt am {date}
    lastSeen: Zuletzt gesehen {distance}
  es:
    header.name: Nombre
    header.email: Correo electrónico
    header.status: Estado
    verified: Verificado
    unverified: No verificado
    createdAt: Creado en {date}
    lastSeen: Última vez visto {distance}
  zh:
    header.name: 名称
    header.email: 电子邮件
    header.status: 状态
    verified: 已验证
    unverified: 未验证
    createdAt: 创建于 {date}
    lastSeen: 上次查看 {distance}
</i18n>
