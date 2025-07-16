<script setup lang="ts">
import AuthFormSsoButton from './AuthFormSsoButton.vue'

const emit = defineEmits<{
  submit: [type: string]
}>()
</script>

<template>
  <div class="space-y-2">
    <AuthFormSsoButton type="microsoft" @click="() => emit('submit', 'microsoft')" />
    <AuthFormSsoButton type="google" @click="() => emit('submit', 'google')" />
    <AuthFormSsoButton type="github" @click="() => emit('submit', 'github')" />
    <AuthFormSsoButton type="linkedin" @click="() => emit('submit', 'linkedin')" />
  </div>
</template>
