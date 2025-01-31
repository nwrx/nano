<script setup lang="ts">
const emit = defineEmits<{
  submit: [UserSetPasswordOptions]
}>()

const oldPassword = ref('')
const newPassword = ref('')
const newPasswordConfirm = ref('')

function onSubmit() {
  emit('submit', {
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
    newPasswordConfirm: newPasswordConfirm.value,
  })
}
</script>

<template>
  <AppPageForm
    vertical
    title="Password"
    label="Update Password"
    @submit="() => onSubmit()">

    <template #text>
      Update your password to keep your account secure. It is recommended to use a strong password
      that you don't use elsewhere and to change it regularly.
    </template>

    <InputText
      v-model="oldPassword"
      icon="i-carbon:password"
      class="w-full"
      placeholder="Current Password"
      type="password"
    />

    <div class="flex w-full gap-4 lt-md:flex-col">
      <InputText
        v-model="newPassword"
        icon="i-carbon:password"
        class="w-full"
        placeholder="New Password"
        type="password"
      />
      <InputText
        v-model="newPasswordConfirm"
        icon="i-carbon:password"
        class="w-full"
        placeholder="Confirm New Password"
        type="password"
      />
    </div>
  </AppPageForm>
</template>
