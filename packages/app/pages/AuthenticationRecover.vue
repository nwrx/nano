<script setup lang="ts">
definePageMeta({
  name: 'AuthenticationRecover',
  path: '/recover',
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
