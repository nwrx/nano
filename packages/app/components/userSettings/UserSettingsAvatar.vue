<script setup lang="ts">
import AppPageForm from '../app/AppPageForm.vue'
import Button from '../base/Button.vue'
import InputImage from '../base/InputImage.vue'

const props = defineProps<{ username: string }>()
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()

async function setAvatar(file: File) {
  await client.requestAttempt('PUT /api/users/:username/avatar', {
    onSuccess: () => alerts.success(t('general.alert.success')),
    parameters: { username: props.username },
    body: { file },
  })
}
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">
    <div class="flex items-center space-x-4 w-full">
      <InputImage
        circular
        :label="t('imageLabel')"
        accept="image/*"
        class="max-w-64"
        @insert="([file]) => setAvatar(file)"
      />
      <div class="w-full py-8">
        <Button
          class="button-danger button-lg"
          icon="i-carbon:trash-can"
          :label="t('imageRemove')"
        />
        <p class="text-sm text-subtle mt-2">
          {{ t('imageHint') }}
        </p>
      </div>
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Profile Picture
  text: Update your profile picture. This can be your photo or any image you like to represent you. Keep in mind that this image will be visible to other users.
  imageLabel: Upload a new profile picture
  imageHint: 'Accepted formats: JPG, PNG, GIF. Max file size: 5MB.'
  imageRemove: Remove current profile picture
</i18n>
