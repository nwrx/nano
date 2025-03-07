<script setup lang="ts">
import type { UserObject } from '@nwrx/nano-api'

const { t } = useI18n()
const client = useClient()
const users = ref<UserObject[]>([])
const showCreate = ref(false)

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
