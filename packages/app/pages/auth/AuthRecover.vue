<script setup lang="ts">
import AuthBackground from '~/components/auth/AuthBackground.vue'
import AuthCard from '~/components/auth/AuthCard.vue'

definePageMeta({
  name: 'AuthenticationRecover',
  path: '/recover',
  middleware: 'redirect-when-authenticated',
})
</script>

<template>
  <AuthBackground>
    <AuthCard>
      TODO
    </AuthCard>
  </AuthBackground>
</template>
