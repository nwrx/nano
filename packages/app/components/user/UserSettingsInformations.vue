<script setup lang="ts">
import type { UserSetProfileOptions } from '~/composables/useUser'

const props = defineProps<{
  displayName: string
  biography?: string
  website?: string
  company?: string
}>()

const emit = defineEmits<{
  submit: [profile: UserSetProfileOptions]
}>()

const displayName = useVModel(props, 'displayName', emit, { passive: true })
const biography = useVModel(props, 'biography', emit, { passive: true })
const website = useVModel(props, 'website', emit, { passive: true })
const company = useVModel(props, 'company', emit, { passive: true })
</script>

<template>
  <AppPageForm
    vertical
    title="Public Informations"
    label="Save Changes"
    @submit="() => emit('submit', { displayName, biography, website, company })">
    <template #text>
      Your public informations allow other users to know more about you. You can update
      your display name, a short bio, your personal website, and your current company.
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
