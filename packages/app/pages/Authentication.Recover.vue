<script setup lang="ts">
definePageMeta({
  name: 'AuthenticationRecover',
  path: '/auth/recover',
  middleware: 'redirect-when-authenticated',
})
</script>

<template>
  <Authentication>
    <AuthenticationCard>
      <AuthenticationFormSignin />
    </AuthenticationCard>
  </Authentication>
</template>
