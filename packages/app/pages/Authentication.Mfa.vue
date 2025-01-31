<script setup lang="ts">
definePageMeta({
  name: 'AuthenticationTotp',
  path: '/auth/totp',
  middleware: 'redirect-when-authenticated',
})
</script>

<template>
  <Authentication>
    <AuthenticationCard>
      <AuthenticationFormTotp />
    </AuthenticationCard>
  </Authentication>
</template>
