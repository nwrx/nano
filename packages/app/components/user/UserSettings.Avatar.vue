<script setup lang="ts">
defineProps<{
  avatarUrl?: string
}>()

const emit = defineEmits<{
  submit: [avatarUrl: File]
}>()
</script>

<template>
  <AppPageForm title="Profile Picture">
    <template #text>
      Update your profile picture. This picture will be visible to other users on the platform.
    </template>

    <InputFile
      label="Upload a new profile picture"
      accept="image/*"
      :model-value="avatarUrl"
      @insert="(avatar) => emit('submit', avatar[0])"
    />
  </AppPageForm>
</template>
