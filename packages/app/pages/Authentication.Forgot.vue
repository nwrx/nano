<script setup lang="ts">
definePageMeta({
  name: 'AuthenticationForgot',
  path: '/auth/forgot-password',
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
