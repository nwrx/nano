<script setup lang="ts">
defineProps<{
  avatarUrl?: string
}>()

const emit = defineEmits<{
  submit: [avatarUrl: File]
}>()
</script>

<template>
  <AppPageForm
    vertical
    title="Profile Picture">
    <template #text>
      Update your profile picture. This can be your photo or any image you like to represent you.
      Keep in mind that this image will be visible to other users.
    </template>

    <div class="flex items-center space-x-4 w-full">
      <InputImage
        circular
        label="Upload a new profile picture"
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
          label="Remove current picture"
        />
        <p class="text-sm text-black/60 mt-2">
          Accepted formats: JPG, PNG, GIF. Max file size: 5MB.
        </p>
      </div>
    </div>
  </AppPageForm>
</template>
