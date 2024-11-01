<script setup lang="ts">
defineProps<{
  avatarUrl?: string
}>()

const emit = defineEmits<{
  submit: [avatarUrl: File]
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">

    <div class="flex items-center space-x-4 w-full">
      <InputImage
        circular
        :label="t('image.upload')"
        accept="image/*"
        :model-value="avatarUrl"
        class="max-w-64"
        @insert="(avatar) => emit('submit', avatar[0])"
      />

      <div class="w-full py-8">
        <Button
          outlined
          variant="danger"
          size="sm"
          icon="i-carbon:trash-can"
          :label="t('image.remove')"
        />
        <p class="text-sm text-black/60 mt-2">
          {{ t('image.hint') }}
        </p>
      </div>
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Profile Picture
  text: Update your profile picture. This can be your photo or any image you like to represent you. Keep in mind that this image will be visible to other users.
  image.upload: Upload a new profile picture
  image.hint: 'Accepted formats: JPG, PNG, GIF. Max file size: 5MB.'
  image.remove: Remove current profile picture
fr:
  title: Photo de profil
  text: Mettez à jour votre photo de profil. Cela peut être votre photo ou n'importe quelle image que vous aimez pour vous représenter. Gardez à l'esprit que cette image sera visible par les autres utilisateurs.
  image.upload: Télécharger une nouvelle photo de profil
  image.hint: 'Formats acceptés : JPG, PNG, GIF. Taille de fichier max : 5 Mo.'
  image.remove: Supprimer la photo de profil actuelle
de:
  title: Profilbild
  text: Aktualisieren Sie Ihr Profilbild. Dies kann Ihr Foto oder ein beliebiges Bild sein, das Sie darstellen möchten. Beachten Sie, dass dieses Bild für andere Benutzer sichtbar ist.
  image.upload: Neues Profilbild hochladen
  image.hint: 'Akzeptierte Formate: JPG, PNG, GIF. Maximale Dateigröße: 5 MB.'
  image.remove: Aktuelles Profilbild entfernen
es:
  title: Foto de perfil
  text: Actualiza tu foto de perfil. Esta puede ser tu foto o cualquier imagen que te guste para representarte. Ten en cuenta que esta imagen será visible para otros usuarios.
  image.upload: Subir una nueva foto de perfil
  image.hint: 'Formatos aceptados: JPG, PNG, GIF. Tamaño máximo de archivo: 5 MB.'
  image.remove: Eliminar la foto de perfil actual
zh:
  title: 头像
  text: 更新您的头像。这可以是您的照片或您喜欢的任何图像来代表您。请注意，此图像将对其他用户可见。
  image.upload: 上传新头像
  image.hint: 接受的格式：JPG、PNG、GIF。最大文件大小：5MB。
  image.remove: 删除当前头像
</i18n>
