<script setup lang="ts">
import AppPageForm from '~/components/app/AppPageForm.vue'
import Button from '~/components/base/Button.vue'
import InputImage from '~/components/base/InputImage.vue'

// --- State.
const { t } = useI18n()
const user = useSession()
const client = useClient()
const alerts = useAlerts()

// --- Methods.
async function uploadAvatar(file: File) {
  if (!user.data.username) return
  await client.requestAttempt('PUT /users/:username/avatar', {
    onSuccess: () => alerts.success(t('general.alert.success')),
    parameters: { username: user.data.username },
    body: { file },
  })
}

// --- Computed avatar URL based on username and API URL.
const avatarUrl = computed(() => {
  if (!user.data.username) return
  const apiUrl = useRuntimeConfig().public.apiUrl
  const avatarUrl = `/users/${user.data.username}/avatar`
  return apiUrl ? new URL(avatarUrl, apiUrl).href : avatarUrl
})
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">
    <div class="flex items-center space-x-4 w-full">

      <!-- Image file input -->
      <InputImage
        circular
        :model-value="avatarUrl"
        :label="t('imageLabel')"
        accept="image/*"
        class="max-w-64 min-w-32"
        @insert="([file]) => uploadAvatar(file)"
      />

      <!-- Action -->
      <div class="w-full py-8">
        <Button
          class="button-danger"
          icon="i-carbon:trash-can"
          :label="t('imageRemove')"
        />

        <!-- Hint -->
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
  imageRemove: Remove profile picture
fr:
  title: Photo de profil
  text: Mettez à jour votre photo de profil. Cela peut être votre photo ou toute image que vous aimez pour vous représenter. Gardez à l'esprit que cette image sera visible par les autres utilisateurs.
  imageLabel: Télécharger une nouvelle photo de profil
  imageHint: 'Formats acceptés : JPG, PNG, GIF. Taille maximale du fichier : 5 Mo.'
  imageRemove: Supprimer la photo de profil
de:
  title: Profilbild
  text: Aktualisieren Sie Ihr Profilbild. Dies kann Ihr Foto oder ein beliebiges Bild sein, das Sie repräsentiert. Beachten Sie, dass dieses Bild für andere Benutzer sichtbar ist.
  imageLabel: Neues Profilbild hochladen
  imageHint: 'Akzeptierte Formate: JPG, PNG, GIF. Maximale Dateigröße: 5 MB.'
  imageRemove: Profilbild entfernen
es:
  title: Foto de perfil
  text: Actualiza tu foto de perfil. Puede ser tu foto o cualquier imagen que te guste para representarte. Ten en cuenta que esta imagen será visible para otros usuarios.
  imageLabel: Subir una nueva foto de perfil
  imageHint: 'Formatos aceptados: JPG, PNG, GIF. Tamaño máximo del archivo: 5 MB.'
  imageRemove: Eliminar foto de perfil
zh:
  title: 个人资料图片
  text: 更新您的个人资料图片。这可以是您的照片或任何您喜欢的代表您的图像。请记住，此图像将对其他用户可见。
  imageLabel: 上传新的个人资料图片
  imageHint: 接受的格式：JPG、PNG、GIF。最大文件大小：5MB。
  imageRemove: 删除个人资料图片
</i18n>
