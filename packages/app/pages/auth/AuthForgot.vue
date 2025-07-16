<script setup lang="ts">
import AuthBackground from '~/components/auth/AuthBackground.vue'
import AuthCard from '~/components/auth/AuthCard.vue'

definePageMeta({
  name: 'AuthenticationForgot',
  path: '/forgot-password',
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
