<script setup lang="ts">
import type { UserObject } from '@nwrx/nano-api'

const { t } = useI18n()
const client = useClient()
const users = ref<UserObject[]>([])

async function getUsers() {
  await client.requestAttempt('GET /api/users', {
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
      <template #header="label">
        {{ t(`header.${label}`) }}
      </template>

      <!-- Cell / Name -->
      <template #cell.name="user">
        <UserCard :display-name="user.displayName" :username="user.username" />
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
            :label="verifiedAt ? t('status.verified') : t('status.unverified')"
          />
          <Badge
            size="small"
            class="font-normal badge-outlined"
            :class="disabledAt ? 'badge-danger' : 'badge-success'"
            :icon="disabledAt ? 'i-carbon:close' : 'i-carbon:checkmark'"
            :label="disabledAt ? t('status.disabled') : t('status.enabled')"
          />
        </div>
      </template>

      <!-- Cell / Actions -->
      <template #cell.status="user">
        <Flags v-slot="dialogs" :keys="['delete', 'disable', 'enable', 'verify', 'impersonate']">
          <ContextMenu x="right" y="top" @mousedown.stop>
            <template #menu>
              <ContextMenuItem :label="t('menu.impersonate')" icon="i-carbon:login" @click="() => dialogs.open('impersonate')" />
              <ContextMenuItem :label="t('menu.verify')" icon="i-carbon:checkmark-outline" @click="() => dialogs.open('verify')" />
              <ContextMenuDivider />
              <ContextMenuItem v-if="!user.disabledAt" :label="t('menu.disable')" icon="i-carbon:close" @click="() => dialogs.open('disable')" />
              <ContextMenuItem v-if="user.disabledAt" :label="t('menu.enable')" icon="i-carbon:checkmark" @click="() => dialogs.open('enable')" />
              <ContextMenuItem :label="t('menu.delete')" icon="i-carbon:trash-can" @click="() => dialogs.open('delete')" />
            </template>
          </ContextMenu>
          <AdminSettingsUsersDialogImpersonate v-model="dialogs.value.impersonate" :user @submit="() => getUsers()" />
          <AdminSettingsUsersDialogDelete v-model="dialogs.value.delete" :user @submit="() => getUsers()" />
          <AdminSettingsUsersDialogDisable v-model="dialogs.value.disable" :user @submit="() => getUsers()" />
          <AdminSettingsUsersDialogEnable v-model="dialogs.value.enable" :user @submit="() => getUsers()" />
          <AdminSettingsUsersDialogVerify v-model="dialogs.value.verify" :user @submit="() => getUsers()" />
        </Flags>
      </template>
    </Table>

    <!-- Create Button -->
    <Flags v-slot="dialogs" :keys="['create']">
      <Hyperlink
        eager
        class="text-sm ml-auto mb-4"
        icon="i-carbon:add"
        icon-append="i-carbon:chevron-right"
        :label="t('create')"
        @click="() => dialogs.open('create')"
      />
      <AdminSettingsUsersDialogCreate v-model="dialogs.value.create" @submit="() => getUsers()" />
    </Flags>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Users
  text: Centralized user management for the entire platform. Note that this only lists to locally stored users and does not include users from external authentication providers. To manage users from external providers, please refer to the respective provider's documentation.
  create: Create a new user
  header:
    name: Name
    email: Email
    status: Status
  status:
    verified: Verified
    unverified: Unverified
    enabled: Enabled
    disabled: Disabled
  menu:
    impersonate: Impersonate
    verify: Verify
    disable: Disable
    enable: Enable
    delete: Delete
</i18n>
