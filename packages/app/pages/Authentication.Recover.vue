<script setup lang="ts">
definePageMeta({
  name: 'AuthenticationRecover',
  path: '/auth/recover',
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
