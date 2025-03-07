<script setup lang="ts">
import type { UserObject } from '@nwrx/nano-api'

const props = defineProps<{ username: string }>()
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const data = ref<UserObject>({} as UserObject)

async function getUser() {
  await client.requestAttempt('GET /api/users/:username', {
    data: {
      username: props.username,
      withProfile: true,
    },
    onData: (user) => {
      data.value = user
    },
  })
}

async function setProfile(profile: UserObject) {
  await client.requestAttempt('PUT /api/users/:username/profile', {
    data: {
      ...profile,
      username: props.username,
    },
    onSuccess: () => {
      alerts.success(t('general.alert.success'))
    },
  })
}

onMounted(getUser)
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')"
    :label="t('label')"
    @submit="() => setProfile(data)">
    <InputText
      v-model="data.displayName"
      :placeholder="t('form.displayName.placeholder')"
      :label="t('form.displayName.label')"
    />
    <InputText
      v-model="data.biography"
      type="textarea"
      :placeholder="t('form.biography.placeholder')"
    />
    <div class="grid grid-cols-1 gap-md md:grid-cols-2 w-full">
      <InputText
        v-model="data.website"
        :label="t('form.website.label')"
        :placeholder="t('form.website.placeholder')"
      />
      <InputText
        v-model="data.company"
        :label="t('form.company.label')"
        :placeholder="t('form.company.placeholder')"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Public Informations
  label: Save Changes
  text: Your public informations allow other users to know more about you. You can update your display name, a short bio, your personal website, and your current company.
  form:
    displayName:
      label: Your display name
      placeholder: Enter your display name
    biography:
      placeholder: Enter a short bio
    website:
      label: Your personal website
      placeholder: Enter your personal website
    company:
      label: Your current company
      placeholder: Enter your current company
</i18n>
