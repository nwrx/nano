<script setup lang="ts">
definePageMeta({
  name: 'AuthenticationTotp',
  path: '/auth/totp',
  middleware: 'guest',
})
</script>

<template>
  <Authentication>
    <AuthenticationCard>
      <AuthenticationFormTotp />
    </AuthenticationCard>
  </Authentication>
</template>
