<script setup lang="ts">
import type { UserSetProfileOptions } from '~/composables/useUser'

const props = defineProps<{
  displayName: string
  biography?: string
  website?: string
  company?: string
}>()

const emit = defineEmits<{
  submit: [UserSetProfileOptions]
  'update:displayName': [string]
  'update:bio': [string]
  'update:website': [string]
  'update:company': [string]
}>()

const displayName = useVModel(props, 'displayName', emit, { passive: true })
const biography = useVModel(props, 'biography', emit, { passive: true })
const website = useVModel(props, 'website', emit, { passive: true })
const company = useVModel(props, 'company', emit, { passive: true })

function submit() {
  emit('submit', {
    displayName: displayName.value,
    biography: biography.value,
    company: company.value,
    website: website.value,
  })
}
</script>

<template>
  <AppPageForm
    title="Public profile"
    submit-label="Save Changes"
    @submit="() => submit()">
    <template #text>
      Update your public profile information. This information will be visible to
      other users on the platform.
      <br />
      <br />
      Note that your email address is not visible to other users.
    </template>

    <InputText
      v-model="displayName"
      placeholder="Your display name"
      hint="Your display name is visible to other users."
    />

    <InputText
      v-model="biography"
      type="textarea"
      placeholder="A short bio about yourself"
    />

    <InputText
      v-model="website"
      label="Website"
      placeholder="Your personal website or blog"
    />

    <InputText
      v-model="company"
      label="Company"
      placeholder="Your current company or organization"
    />
  </AppPageForm>
</template>
