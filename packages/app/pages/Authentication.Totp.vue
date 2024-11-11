<script setup lang="ts">
definePageMeta({
  name: 'AuthenticationTotp',
  path: '/login/totp',
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
