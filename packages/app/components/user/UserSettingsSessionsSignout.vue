<script setup lang="ts">
defineProps<{
  sessionsLength: number
}>()

const emit = defineEmits<{
  submitSignout: []
}>()

const isDialogSignoutOpen = ref(false)
</script>

<template>
  <AppPageForm title="Sign out from all devices" vertical>
    <template #text>
      If you notice any suspicious activity on your account, you can sign out from all devices at once.
      It's a good idea to do this if you've lost your phone or computer or if you think someone has gained
      access to your account. For increase security, you can also
      <Button
        link
        variant="primary"
        label="change your password"
        :to="{ name: 'UserSettingsPassword' }"
      />
      or setup
      <Button
        link
        variant="primary"
        label="multi-factor authentication"
        :to="{ name: 'UserSettingsPassword', hash: '#mfa' }"
      />.
    </template>

    <!-- Actions -->
    <AppPageFormActions variant="danger">
      <AppPageFormAction
        variant="danger"
        title="Sign out from all devices"
        text="Note that you will also be signed out from this device."
        label="Sign out"
        @click="() => isDialogSignoutOpen = true"
      />
    </AppPageFormActions>

    <!-- Dialog -->
    <UserSettingsSessionsSignoutDialog
      v-model="isDialogSignoutOpen"
      :sessions-length="sessionsLength"
      @submit="() => emit('submitSignout')"
    />
  </AppPageForm>
</template>
