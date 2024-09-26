<script setup lang="ts">
definePageMeta({
  name: 'AuthenticationForgot',
  path: '/auth/forgot-password',
  middleware: 'guest',
})
</script>

<template>
  <Authentication>
    <AuthenticationCard>
      <AuthenticationFormSignin />
    </AuthenticationCard>
  </Authentication>
</template>
